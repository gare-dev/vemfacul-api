import pool from "../db/connect";

export class NotificationsRepository {
  async insertNotification(id_user: number, id_actor: number, id_post: number, type: string) {
    const values = [id_user, id_actor, id_post, type]
    const query = "INSERT INTO notifications_table (id_user, id_actor, id_postagem, type) VALUES ($1, $2, $3, $4);"
    return await pool.query(query, values);
  }
  async selectNotification(mode: string, id_user: number) {
    const values = [id_user]
    let query
    if (mode == "postagem") query = `select d.username as destinatiario, n.id_postagem, a.username as ator, n.type as tipo, p.content as postagem
                        from notifications_table n 
                        join users_table d on d.id_user = n.id_user
                        join users_table a on a.id_user = n.id_actor
                        join postagens_table p on p.id_postagem = n.id_postagem
                        where d.id_user = $1 and a.id_user != d.id_user
                        order by n.created_at DESC`

    if (mode == "redacao") query = ` select
                        u.username,
                        content,
                        type as tipo
                        from
                        notifications_table n
                        join users_table u 
                        on u.id_user = n.id_user
                        where type like '%Redação' AND u.id_user = $1
                        order by n.created_at DESC`
    if (mode == "denuncias") query = ` select
                        type as tipo,
                        content
                        from notifications_table n
                        join users_table u 
                        on u.id_user = n.id_user
                        where type = 'Denuncias' AND u.id_user = $1
                        order by n.created_at DESC`

    const query2 = "UPDATE notifications_table SET read = TRUE WHERE id_user = $1"
    const [res1, res2] = await Promise.all([
      pool.query(query ?? "", values),
      pool.query(query2, values)
    ])
    return res1
  }

  async getNotificationsQuantity(id_user: string) {
    const values = [id_user]

    const query = "SELECT COUNT(*) FROM notifications_table WHERE id_user = $1 AND read = FALSE"
    return await pool.query(query, values)
  }
}