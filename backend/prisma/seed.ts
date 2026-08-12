
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding with custom output...');

  const adminPass = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tourmate.com' },
    update: { password: adminPass, role: 'ADMIN', isDeleted: false },
    create: { name: 'Admin', email: 'admin@tourmate.com', password: adminPass, role: 'ADMIN' },
  });

  const userPass = await bcrypt.hash('user123', 12);
  await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: { password: userPass, role: 'USER', isDeleted: false },
    create: { name: 'Arnob', email: 'user@gmail.com', password: userPass, role: 'USER' },
  });

  const cats = [
    { name: 'Beach', slug: 'beach', description: 'Sea beach and island tours' },
    { name: 'Hill', slug: 'hill', description: 'Hill tracking' },
    { name: 'Forest', slug: 'forest', description: 'Forest & Sundarban' },
    { name: 'Historical', slug: 'historical', description: 'Heritage' },
    { name: 'Haor & Lake', slug: 'haor-lake', description: 'Haor houseboat' },
    { name: 'City Tour', slug: 'city-tour', description: 'City tour' },
  ];
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const getCat = async (slug: string) => (await prisma.category.findUnique({ where: { slug } }))!;

  const packages = [
    { title: "Cox's Bazar Relax", slug: 'coxs-bazar-relax-tour', location: "Cox's Bazar", price: 5500, duration: '3 Days 2 Nights', maxGroupSize: 20, cat: 'beach', desc: 'Longest sea beach', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
    { title: "Saint Martin Escape", slug: 'saint-martin-escape', location: "Saint Martin", price: 6500, duration: '3 Days 2 Nights', maxGroupSize: 15, cat: 'beach', desc: 'Blue water island', img: 'https://images.unsplash.com/photo-1519046904884-53103b34f59d' },
    { title: "Sajek Valley Cloud", slug: 'sajek-valley-cloud-tour', location: "Sajek, Rangamati", price: 4500, duration: '2 Days 1 Night', maxGroupSize: 15, cat: 'hill', desc: 'Above clouds', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b' },
    { title: "Bandarban Nilgiri", slug: 'bandarban-nilgiri-night', location: "Bandarban", price: 5000, duration: '2 Days 2 Nights', maxGroupSize: 12, cat: 'hill', desc: 'Nilgiri tour', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4' },
    { title: "Sundarban Safari", slug: 'sundarban-tiger-safari', location: "Sundarban", price: 8500, duration: '3 Days 2 Nights', maxGroupSize: 25, cat: 'forest', desc: 'Tiger safari', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e' },
    { title: "Sreemangal Tea", slug: 'sreemangal-tea-garden', location: "Sreemangal", price: 4000, duration: '2 Days 1 Night', maxGroupSize: 20, cat: 'forest', desc: 'Tea garden', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9' },
    { title: "Jaflong Zero Point", slug: 'jaflong-zero-point', location: "Jaflong, Sylhet", price: 3500, duration: '1 Day', maxGroupSize: 20, cat: 'haor-lake', desc: 'Stone river', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e' },
    { title: "Kuakata Beach", slug: 'kuakata-sunrise-sunset', location: "Kuakata", price: 4800, duration: '2 Days 2 Nights', maxGroupSize: 18, cat: 'beach', desc: 'Sunrise sunset', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0' },
    { title: "Rangamati Kaptai", slug: 'rangamati-kaptai-lake', location: "Rangamati", price: 4200, duration: '2 Days 1 Night', maxGroupSize: 20, cat: 'haor-lake', desc: 'Lake tour', img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000' },
    { title: "Ratargul Swamp", slug: 'ratargul-swamp-forest', location: "Sylhet", price: 3800, duration: '1 Day', maxGroupSize: 15, cat: 'forest', desc: 'Swamp forest', img: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8' },
    { title: "Cox's Honeymoon", slug: 'coxs-bazar-honeymoon', location: "Cox's Bazar", price: 12500, duration: '3 Days 2 Nights', maxGroupSize: 2, cat: 'beach', desc: 'Couple', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4' },
    { title: "Boga Lake Trek", slug: 'boga-lake-trekking', location: "Bandarban", price: 6000, duration: '3 Days 2 Nights', maxGroupSize: 10, cat: 'hill', desc: 'Trekking', img: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084' },
    { title: "Sajek + Khagrachari", slug: 'sajek-khagrachari-combo', location: "Sajek + Khagrachari", price: 5500, duration: '3 Days 2 Nights', maxGroupSize: 18, cat: 'hill', desc: 'Combo', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' },
    { title: "Tanguar Haor", slug: 'tanguar-haor-houseboat', location: "Sunamganj", price: 5000, duration: '2 Days 1 Night', maxGroupSize: 16, cat: 'haor-lake', desc: 'Houseboat', img: 'https://images.unsplash.com/photo-1505142468610-359e7bcbe29c' },
    { title: "Paharpur Bihar", slug: 'paharpur-mahavihara', location: "Naogaon", price: 3000, duration: '1 Day', maxGroupSize: 25, cat: 'historical', desc: 'UNESCO', img: 'https://images.unsplash.com/photo-1461360228755-6e81c478b882' },
    { title: "Old Dhaka", slug: 'old-dhaka-heritage', location: "Old Dhaka", price: 1500, duration: '1 Day', maxGroupSize: 30, cat: 'city-tour', desc: 'Heritage', img: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb' },
    { title: "Saint Martin Scuba", slug: 'saint-martin-scuba', location: "Saint Martin", price: 9000, duration: '2 Days 1 Night', maxGroupSize: 8, cat: 'beach', desc: 'Scuba', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5' },
    { title: "Kuakata Sundarban", slug: 'kuakata-sundarban-combo', location: "Kuakata + Sundarban", price: 11000, duration: '4 Days 3 Nights', maxGroupSize: 20, cat: 'forest', desc: 'Combo', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b' },
    { title: "Lawachara Forest", slug: 'lawachara-rain-forest', location: "Moulvibazar", price: 3500, duration: '1 Day', maxGroupSize: 20, cat: 'forest', desc: 'Rain forest', img: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1' },
    { title: "Thanchi Remakri", slug: 'thanchi-remakri-adventure', location: "Thanchi, Bandarban", price: 7000, duration: '3 Days 2 Nights', maxGroupSize: 10, cat: 'hill', desc: 'Adventure', img: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3' },
  ];

  for (const p of packages) {
    const cat = await getCat(p.cat);
    await prisma.tourPackage.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.desc,
        location: p.location,
        price: p.price,
        duration: p.duration,
        maxGroupSize: p.maxGroupSize,
        images: [p.img],
        categoryId: cat.id,
        createdById: admin.id,
        status: 'ACTIVE',
      },
    });
  }
  console.log('20 packages seeded done!');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); await pool.end(); });
