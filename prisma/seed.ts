import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@local.com' },
    update: {},
    create: {
      email: 'admin@local.com',
      username: 'qui_nguyen',
      password: 'hashed_password_123',
      avatarUrl: 'https://ui-avatars.com/api/?name=Qui+Nguyen&background=random',
      jobTitle: 'Chuyên viên',
    },
  });

  console.log('Tạo User thành công:', user.username);

  const pinsData = [
    { title: 'Góc làm việc tối giản', imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80' },
    { title: 'Decor phòng khách', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80' },
    { title: 'Phòng ngủ ấm cúng', imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=600&fit=crop' },
    { title: 'Bàn phím cơ Custom', imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
  ];

  for (const pin of pinsData) {
    await prisma.pin.create({
      data: {
        title: pin.title,
        imageUrl: pin.imageUrl,
        description: 'Mô tả chi tiết cho ' + pin.title,
        authorId: user.id,
      },
    });
  }

  console.log('Seed dữ liệu Pins thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });