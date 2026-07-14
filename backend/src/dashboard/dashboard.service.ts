import { Injectable } from '@nestjs/common';
import { TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      total,
      pending,
      working,
      resolved,
      cancelled,
      createdLast7Days,
      resolvedLast7Days,
      resolvedTickets,
    ] = await this.prisma.$transaction([
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: TicketStatus.PENDING } }),
      this.prisma.ticket.count({ where: { status: TicketStatus.WORKING } }),
      this.prisma.ticket.count({ where: { status: TicketStatus.RESOLVED } }),
      this.prisma.ticket.count({ where: { status: TicketStatus.CANCELLED } }),
      this.prisma.ticket.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.ticket.count({
        where: {
          status: TicketStatus.RESOLVED,
          updatedAt: { gte: sevenDaysAgo },
        },
      }),
      this.prisma.ticket.findMany({
        where: { status: TicketStatus.RESOLVED },
        select: { createdAt: true, updatedAt: true },
      }),
    ]);

    const averageResolutionTimeInHours = this.calculateAverageResolutionTime(resolvedTickets);

    return {
      total,
      byStatus: {
        pending,
        working,
        resolved,
        cancelled,
      },
      last7Days: {
        created: createdLast7Days,
        resolved: resolvedLast7Days,
      },
      averageResolutionTimeInHours,
    };
  }

  private calculateAverageResolutionTime(
    tickets: { createdAt: Date; updatedAt: Date }[],
  ): number | null {
    if (tickets.length === 0) {
      return null;
    }

    const totalHours = tickets.reduce((sum, ticket) => {
      const diffMs = ticket.updatedAt.getTime() - ticket.createdAt.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);

    return Number((totalHours / tickets.length).toFixed(2));
  }
}
