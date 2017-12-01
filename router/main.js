module.exports = function(app, fs){
    app.get('/', function(req, res){
        var sess = req.session;

        res.render('index', {
            title: "MY HOMEPAGE", // JSON 데이터를 render메소드의 두번째 인자로 전달
            length: 5, // 페이지에서 데이터를 사용 가능
            name: sess.name,
            username: sess.username
        });
    });

    app.get('/list', function(req, res){
        fs.readFile(__dirname +"/../data/"+"user.json", 'utf8', function(err, data){
            console.log(data);
            res.end(data);
        });
    });

    app.get('/getUser/:username', function(req, res){
        fs.readFile(__dirname+"/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    // 데이터 저장
    app.post('/addUser/:username', function(req, res){
        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }
        
        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            });
        });
    });

    // 데이터 삭제
    app.delete('/deleteUser/:username', function(req, res){
        var result = { };
        //LOAD DATA
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username];
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            });
        });
    });
    
    // 로그인
    app.get('/login/:username/:password', function(req, res){
        var sess;
        sess = req.session;

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};

            if(!users[username]){
                // Username을 찾을 수 없을 떄
                result["seccess"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[username]["password"] == password){
                result["seccess"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
            }else{
                result["seccess"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        });
    });

    //로그아웃
    app.get('/logout', function(req, res){
        sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            });
        }else{
            res.redirect('/');
        }
    });
}