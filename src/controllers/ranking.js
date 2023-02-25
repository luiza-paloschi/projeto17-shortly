import db from "../config/database.js";

export async function getRanking(_, res){
    try {
        
        const ranking = await db.query(
            `SELECT users.id, users.name,  CAST(COALESCE(COUNT(urls.id), 0) AS INTEGER) as "linksCount",
            CAST(COALESCE(SUM(urls."visitCount"), 0) AS INTEGER) as "visitCount"
          FROM users
          LEFT JOIN urls ON users.id = urls."userId"
          GROUP BY users.id
          ORDER BY "visitCount" DESC
          LIMIT 10
          ;`
        );
            
        res.status(200).send(ranking.rows)

    } catch (error) {
        res.status(500).send(error.message);
    }
}