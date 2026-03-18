require('dotenv').config();
const { Pool } = require('pg');

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
        const before = Number((await pool.query('SELECT COUNT(*)::int AS c FROM messages')).rows[0].c);

        const dedupeSql = `
            WITH ranked AS (
                SELECT
                    id,
                    ROW_NUMBER() OVER (
                        PARTITION BY
                            LOWER(COALESCE(name, '')),
                            LOWER(COALESCE(email, '')),
                            COALESCE(subject, ''),
                            COALESCE(message, '')
                        ORDER BY created_at ASC, id ASC
                    ) AS rn
                FROM messages
            )
            DELETE FROM messages m
            USING ranked r
            WHERE m.id = r.id AND r.rn > 1
            RETURNING m.id
        `;

        const deleted = await pool.query(dedupeSql);
        const after = Number((await pool.query('SELECT COUNT(*)::int AS c FROM messages')).rows[0].c);

        console.log(JSON.stringify({
            before,
            deleted: deleted.rowCount,
            after
        }, null, 2));
    } finally {
        await pool.end();
    }
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
