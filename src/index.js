import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

app.get('/produto', async (req, resp) => {
    try {
        let produtos = await db.tb_produto.findAll({ order: [['id_produto', 'desc']] });
        resp.send(produtos);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/produto', async (req, resp) => {
    try {
        let { produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem } = req.body;
        let consulta = await db.tb_produto.findOne({ where: {nm_produto: produto} })
        if(consulta != null){
            resp.send({erro: 'Esse produto já existe!'})
        } else
                if(produto == "" || categoria == "" || precode == "" || precopor == "" || avaliacao == "" || descricao == "" || estoque == "" || imagem == ""){
                    resp.send({ erro: "Todos os campos são obrigatórios!" })
                } else {
                    let r = await db.tb_produto.create({
                        nm_produto: produto,
                        ds_categoria: categoria,
                        vl_preco_de: precode,
                        vl_preco_por: precopor, 
                        vl_avaliacao: avaliacao, 
                        ds_produto: descricao, 
                        qtd_estoque: estoque, 
                        img_produto: imagem
                    })
                    resp.send(r);
                }
    } catch (e) {
        resp.send({ erro: 'Somente números nos campos: "Avaliação", "Preço POR", "Preço DE" e "Estoque"'})
    }
})

app.put('/produto/:id', async (req, resp) => {
    try {
        let { produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem } = req.body;
        let { id } = req.params;
        let r = await db.tb_produto.update(
            {
                nm_produto: produto,
                ds_categoria: categoria,
                vl_preco_de: precode,
                vl_preco_por: precopor, 
                vl_avaliacao: avaliacao, 
                ds_produto: descricao, 
                qtd_estoque: estoque, 
                img_produto: imagem
            },
            {
                where: { id_produto: id }
            }
        )
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.delete('/produto/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.tb_produto.destroy({ where: { id_produto: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.listen(process.env.PORT,
    x => console.log(`Server up at port ${process.env.PORT}`))