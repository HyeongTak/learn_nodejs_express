module.exports = function(app, fs){
    app.get('/', function(req, res){
        res.render('index', {
            title: "MY HOMEPAGE", // JSON 데이터를 render메소드의 두번째 인자로 전달
            length: 5 // 페이지에서 데이터를 사용 가능
        });
    });

    app.get('/list', function(req, res){
        fs.readFile(__dirname +"/../data/"+"user.json", 'utf8', function(err, data){
            console.log(data);
            res.end(data);
        });
    });
}