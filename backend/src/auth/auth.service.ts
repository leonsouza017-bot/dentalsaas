import 'dotenv/config';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async register(name: string, email: string, password: string, clinicName: string) {
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const hash = await bcrypt.hash(password, 12);

    // Cria clínica e usuário em sequência
    const clinic = await prisma.clinic.create({
      data: { name: clinicName, email },
    });

    const user = await prisma.user.create({
      data: { name, email, password: hash, clinicId: clinic.id },
    });

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      clinicId: clinic.id,
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
      clinic: { id: clinic.id, name: clinic.name },
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: { email },
      include: { clinic: true },
    });

    if (!user) throw new UnauthorizedException('E-mail ou senha inválidos.');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('E-mail ou senha inválidos.');

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      clinicId: user.clinicId,
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
      clinic: { id: user.clinicId, name: user.clinic.name },
    };
  }
}