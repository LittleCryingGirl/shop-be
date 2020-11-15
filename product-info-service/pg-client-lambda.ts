import { Client } from 'pg';
interface ICreateNewProductParams {
  title: string,
  description: string,
  price: number,
  image_url: string,
  count: string
}

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

export const getProductsFromDB = async () => {
  const  client = new Client(dbOptions);
  await client.connect();
  await createIfNotExists(client);

  try {
    const { rows: products } = await client.query(`select * FROM products p left join (select count, product_id from stocks) as s ON s.product_id = p.id`);
    console.log(products);
    return products;

  } catch (e) {
    console.error('Whoops!... Some error occurred during database request executing: ', e);
    throw new Error('Whoops!... Some error occurred during database request executing.')
  } finally {
    client.end();
  }
};


export const getProductByIdFromDB = async (id) => {
  const client = new Client(dbOptions);
  console.log('Id to find: ', id);
  await client.connect();

  try {
    const { rows: product } = await client.query(`select * from products p where p.id = $1`, [id]);
    const { rows: stock } = await client.query(`select * from stocks s where s.product_id = $1`, [id]);
    console.log('product: ', product[0]);
    console.log('stock: ', stock[0]);

    return {
      ...product[0],
      count: stock[0].count
    }

  } catch (e) {
    console.error('Whoops!... Some error occurred during database request executing: ', e);
    throw new Error('Whoops!... Some error occurred during database request executing.')
  } finally {
    client.end();
  }
};

export const addNewProductToBD = async ({ description, title, price, image_url, count }: ICreateNewProductParams) => {
  console.log('Data to add: ', description, title, price, image_url, count);
  const  client = new Client(dbOptions);
  await client.connect();

  try {
    await createIfNotExists(client);
    const new_product = await client.query('insert into products (description , price, title, image_url) values ($1, $2, $3, $4) returning *', [description, price, title, image_url]);
    console.log(new_product);
    const new_stock = await client.query('insert into stocks (product_id, count) values ($1, $2) returning *', [new_product.rows[0].id, count]);
    console.log(new_stock);
    return {
      ...new_product.rows[0],
      count: new_stock.rows[0].count
    }
  } catch (e) {
    throw new Error(`Whoops!... Some error occurred during database request executing: ${e}`)
  } finally {
    client.end();
  }
  
}

const createIfNotExists = async (client) => {

  const createProductsTableDdl = await client.query(`
    create table if not exists products (
      id serial primary key,
      description text,
      price integer,
      title text
    )
  `);
  const createStocksTableDdl = await client.query(`
    create table if not exists stocks (
      id serial primary key,
      product_id uuid,
      count integer,
      foreign key ("product_id") references "products" ("id")
    )
  `);
}
