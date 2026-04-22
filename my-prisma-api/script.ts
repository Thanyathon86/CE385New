import { prisma } from './lib/prisma'


async function main() {
    const users = [
        { Userid: '1', name: 'tonnam', email: 'tonnam@gmail.com' },
        { Userid: '2', name: 'champ', email: 'champ@gmail.com' },
        { Userid: '3', name: 'beer', email: 'beer@gmail.com' },
    ];
    for (const user of users) {
        const created = await prisma.user.create({
            data: user,
        });
        console.log('Created user:', created);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })