
const express = require('express');   
const app = express();                                                     

const axios = require('axios');                                                            

const bodyParser = require('body-parser');                                                  
const { response } = require('express');
 
app.set('view engine', 'ejs')                                                               

app.use(bodyParser.urlencoded({ extended: false }));                                        
app.use(bodyParser.json());                                   
             
app.get('/', function(req, res){                                                            //route inicial

    res.render('userform', {                                                                //rendering do form sem mensagem                                   
        message: ''
    });
    
})

app.post('/', function(req, res){                                                           //route de submeter o form
    
    var name = req.body.name;                                                               //variaveis do form
    var username = req.body.username;
    var email = req.body.email;
    var pass = req.body.pass;
    var passconf = req.body.passconf;

    if(name != "" && username != "" && email != "" && pass != "" && pass == passconf){      //se tudo estiver preenchido e confirmação da password estar correta
        registerUser(res, name, username, email, pass);                                     //tenta registar utilizador com função registerUser
    }

    else{                                                                                   //se houver algum campo do form em falta
        res.render('userform', {                                                            //faz rendering do form com mensagem que o form estava incompleto 
            message: "Form incomplete"
        });
    }
                                              
});





const port = process.env.PORT || 3002;                                                      
app.listen(port, function(){                                                                //server está a ouvir no port 3002       
    console.log(`Listening on port ${port}`);      
});

async function registerUser(res, name, username, email, pass) {                             //função assincrona para registar utilizador no Rocketchat

    try {
        let response = await axios.post('http://localhost:3000/api/v1/users.register',      //post para rocketchat api/v1/users.register
            {                                                                     
                "username": username,                                                       //json dos parametros do utilizador para registar
                "email": email,                                                               
                "pass": pass,
                "name": name                                                              
            }
            , 
            {
                headers: {                                                                  //header com conteudo application/json para poder fazer post de json
                  'Content-Type': 'application/json'
                }
            })
            .catch(                                                                        
                function (error) {
                    return Promise.reject(error);
                }
            );

        
        let data = response.data;                                                     
        
        res.render('userform', {                                       
            message: "User " + data.user.username + " successfully created."                //render do Form com mensagem que o utilizador foi criado com sucesso
        });

    } catch (error) {                                                                      
        res.render('userform', {                                                            //se acontecer um erro faz render com mensagem de erro
            message: error
        });                                     
    }

}
