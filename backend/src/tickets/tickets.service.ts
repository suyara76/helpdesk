import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { QueryTicketsDto } from './dto/query-tickets.dto';
import { TicketStatus } from '@prisma/client';

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  PENDING: [TicketStatus.WORKING, TicketStatus.CANCELLED],
  WORKING: [TicketStatus.RESOLVED, TicketStatus.CANCELLED],
  RESOLVED: [],
  CANCELLED: [],
};

interface Requester {
  userId: string;
  role: UserRole;
}

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(requester: Requester, dto: CreateTicketDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: requester.userId },
    });
    
    if (!user || !user.ativo){
      throw new ForbiddenException ('Inactive users cannot create tickets');
    }

    return this.prisma.ticket.create({
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        priority: dto.priority ?? 'MEDIUM',
        usuarioId:requester.userId,
        status: TicketStatus.PENDING,
      },
    });
  }

  async findAll(requester: Requester, query: QueryTicketsDto) {
    const { status, usuarioId, search, sortBy, order, page, limit, createdAfter, createdBefore, priority } = query;

    const ownerFilter = requester.role === UserRole.CLIENT ? requester.userId: usuarioId;

    const where: Prisma.TicketWhereInput = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(ownerFilter && {usuarioId: ownerFilter }),
      ...(search && {
        OR: [
          { titulo: { contains: search, mode: 'insensitive' } },
          { descricao: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...((createdAfter || createdBefore) &&{
        createdAt: {
          ...(createdAfter && { gte: new Date(createdAfter) }),
          ...(createdBefore && {lte: new Date(createdBefore) }),
        },
      }),
    };

    const currentPage = page ?? 1;
    const pageSize = limit ?? 10;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where,
        orderBy: { [sortBy ?? 'createdAt']: order ?? 'desc' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        include: {
          usuario: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string, requester: Requester) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const isOwner = ticket.usuarioId === requester.userId;
    const isStaff = requester.role === UserRole.ADMIN || requester.role === UserRole.AGENT;
    
    if(!isOwner && "isStaff"){
      throw new ForbiddenException('you cannot view this ticket');
    }

    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto, requester: Requester) {
    const ticket = await this.findOne(id, requester);

    const isOwner = ticket.usuarioId === requester.userId;
    const isStaff = requester.role === UserRole.ADMIN || requester.role === UserRole.AGENT;

    if (!isOwner && !isStaff) {
      throw new ForbiddenException('You cannot edit this ticket');
    }

    return this.prisma.ticket.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, dto: UpdateTicketStatusDto, requester: Requester) {
    const ticket = await this.findOne(id, requester);

    const allowedNext = ALLOWED_TRANSITIONS[ticket.status];

    if (!allowedNext.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot change status from ${ticket.status} to ${dto.status}`,
      );
    }

    return this.prisma.ticket.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}