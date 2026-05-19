import 'dotenv/config';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });

    // Init Models
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync models with database (auto-creates tables)
    await sequelize.sync({ alter: true });

    console.log('Database connected and tables synced!');
}