import { PrismaClient } from "@prisma/client"

class DatabaseClient {
  static prisma: PrismaClient | null = null

  static get() {
    if (DatabaseClient.prisma === null) {
      DatabaseClient.prisma = new PrismaClient()
      return DatabaseClient.prisma
    }

    return DatabaseClient.prisma
  }
}

export default DatabaseClient
