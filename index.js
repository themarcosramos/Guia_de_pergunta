const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require("./database/database");
const pergunta = require("./model/Pergunta");
const resposta = require("./model/Resposta");

connection
    .authenticate()
    .then(()=>{
        console.log("Conexao feita com o banco de dados !");
    })
    .catch((msgErro)=>{
             console.log(msgErro);
    });

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    pergunta.findAll({raw :true,order:[
        ['id','DESC']
    ]}).then(perguntas =>{
        console.log(perguntas);
        res.render("index.ejs",{
            perguntas:perguntas
        });
    });
});

app.post("/salvarpergunta",(req,res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
});

app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
});

app.get("/pergunta/:id",(req,res)=>{
    let id = req.params.id;
    pergunta.findOne({
        where :{
            id:id
        }
    }).then(pergunta=>{
        if(pergunta != undefined){

            resposta.findAll({
                where:{perguntaId: pergunta.id },
                order:[
                    ['id','DESC']
                ]
            }).then(respostas =>{

                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas
                });
            });

        }else{
            res.redirect("/");
        }
    });
});

app.post("/responder",(req,res) =>{
  let corpo = req.body.corpo;
  let perguntaId = req.body.pergunta;
  resposta.create({
    corpo:corpo,
    perguntaId:perguntaId
  }).then(()=>{
    res.redirect(`/pergunta/${perguntaId}`);
  });

});
app.listen(3000,()=>{ console.log("servidor rodando !")});