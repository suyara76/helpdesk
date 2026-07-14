import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { QueryTicketsDto } from './dto/query-tickets.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request } from 'express';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.AGENT, UserRole.CLIENT)
  @ApiOperation({ summary: 'Create a new ticket' })
  create(@Req() req: Request, @Body() dto: CreateTicketDto) {
    if (!req.user) {
      throw new ForbiddenException();
    }
    return this.ticketsService.create(req.user, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.AGENT, UserRole.CLIENT)
  @ApiOperation({
    summary: 'List tickets with filters, sorting and pagination',
  })
  findAll(@Req() req: Request, @Query() query: QueryTicketsDto) {
    return this.ticketsService.findAll(req.user!, query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.AGENT, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get ticket details by id' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.ticketsService.findOne(id, req.user!);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.AGENT, UserRole.CLIENT)
  @ApiOperation({ summary: 'Update ticket title/description' })
  update(@Param('id') id: string, @Req() req: Request, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto, req.user!);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: 'Update ticket status (Admin/Agent only)' })
  updateStatus(@Param('id') id: string, @Req() req: Request, @Body() dto: UpdateTicketStatusDto) {
    return this.ticketsService.updateStatus(id, dto, req.user!);
  }
}
