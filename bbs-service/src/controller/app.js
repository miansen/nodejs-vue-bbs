const fs = require('fs');
const path = require('path');
const Koa = require('koa2');
const KoaBody = require('koa-body');
const KoaRouter = require('koa-router');
const Cors = require('@koa/cors');
const send = require('koa-send');

const userService = require('../service/UserService');
const tabService = require('../service/TabService');
const xxjjService = require('../service/XxjjService');
const postService = require('../service/PostService');
const commentService = require('../service/CommentService');
const likerService = require('../service/LikerService');
const fileService = require('../service/FileService');

const app = new Koa();
app.use(Cors());
app.use(KoaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024
    }
}));

const router = new KoaRouter();

router.post('/register', async (ctx, next) => {
    const { username, password, nickname } = ctx.request.body;
    let user = {
        username: username,
        nickname: nickname,
        password: password,
        role: "user",
        createDate: new Date()
    }
    let error = '';
    try {
        await userService.save(user);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data: user, error };
});

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;
    let data = {};
    let error = '';
    try {
        let user = await userService.getByUsernameAndPassword(username, password);
        if (!user) {
            error = '用户名或密码错误';
        } else {
            data = user;
        }
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.post('/add_user', async (ctx, next) => {
    const user = ctx.request.body;
    user.role = "user";
    user.createDate = new Date();
    let error = '';
    try {
        await userService.save(user);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data: user, error };
});

router.put('/update_user', async (ctx, next) => {
    const user = ctx.request.body;
    user.updateDate = new Date();
    let data = '';
    let error = '';
    try {
        await userService.update(user);
        data = '更新用户成功';
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.delete('/delete_user', async (ctx, next) => {
    const { username } = ctx.query;
    let data = '';
    let error = '';
    try {
        await userService.deleteByUsername(username);
        data = '删除用户成功';
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.post('/search_users', async (ctx, next) => {
    const { page, limit } = ctx.request.body;
    let data = null;
    let total = 0;
    let error = '';
    try {
        total = await userService.count();
        data = await userService.list(page, limit);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, total, page, limit, error };
});

router.post('/add_invitation', async (ctx, next) => {
    const post = ctx.request.body;
    let data = '';
    let error = '';
    try {
        let user = await userService.getByUsername(post.username);
        post.nickname = user.nickname;
        post.isTop = false;
        post.date = Date.now();
        await postService.save(post);
        data = '发布帖子成功';
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.put('/update_invitation', async (ctx, next) => {
    const post = ctx.request.body;
    let data = '';
    let error = '';
    try {
        await postService.update(post);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.post('/search_invitations', async (ctx, next) => {
    const { page, limit, username, keywords, tab } = ctx.request.body;
    let data = null;
    let total = 0;
    let error = '';
    try {
        let query = {
            username: username,
            title: keywords,
            tab: tab
        };
        data = await postService.list(query, page, limit);
        total = await postService.count(query);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, total, page, limit, error };
});

router.get('/toggle_top', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = null;
    let error = '';
    try {
        let postModel = await postService.getById(id);
        let post = postModel.dataValues;
        post.isTop = !post.isTop;
        await postService.update(post);
        data = "置顶成功";
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.delete('/delete_invitation', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = null;
    let error = '';
    try {
        await postService.deleteById(id);
        data = '删除帖子成功';
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});


router.post('/like/save', async (ctx, next) => {
    const like = ctx.request.body;
    let data = '';
    let error = '';
    try {
        let post = await postService.getById(like.postId);
        await post.createLike(like);
        data = "点赞成功";
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.post('/comment/save', async (ctx, next) => {
    const comment = ctx.request.body;
    let data = '';
    let error = '';
    try {
        await commentService.save(comment);
        data = "评论成功";
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});





router.post('/tab/add', async (ctx, next) => {
    const tab = ctx.request.body;
    let data = '';
    let error = '';
    try {
        await tabService.save(tab);
        data = "添加成功";
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.delete('/tab/delete', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = '';
    let error = '';
    try {
        await tabService.deleteById(id);
        data = "删除成功";
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.put('/tab/update', async (ctx, next) => {
    const tab = ctx.request.body;
    let data = '';
    let error = '';
    try {
        await tabService.update(tab);
        data = "更新成功";
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.post('/tab/list', async (ctx, next) => {
    const { page, limit } = ctx.request.body;
    let data = [];
    let total = 0;
    let error = '';
    try {
        total = await tabService.count();
        data = await tabService.list(page, limit);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, total, page, limit, error };
});

router.get('/xxjj/detail', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = {};
    let error = '';
    try {
        data = await xxjjService.getById(id);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.put('/xxjj/update', async (ctx, next) => {
    const xxjj = ctx.request.body;
    let data = '';
    let error = '';
    try {
        await xxjjService.update(xxjj);
        data = "更新成功";
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});


router.post('/upload', async (ctx, next) => {
    let data = {};
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, `../../upload/${file.name}`);
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    data.name = file.name;
    data.url = "/download/" + file.name;
    ctx.body = { code: 200, data};
});

router.get('/download/:name', async (ctx, next) => {
    const fileName = ctx.params.name;
    // ctx.set("Content-disposition", "attachment; filename=" + fileName);
    ctx.attachment(fileName);
    await send(ctx, fileName, { root: __dirname + '../../../upload' });
})

router.get('/user/save', async (ctx, next) => {
    const username = ctx.query.username;
    const password = ctx.query.password;
    const nickname = ctx.query.nickname;
    const role = ctx.query.role;
    const user = await userService.save(username, password, nickname, role);
    ctx.body = JSON.stringify(user);
});

router.get('/user/detail', async (ctx, next) => {
    const id = ctx.query.id;
    const user = await userService.getById(id);
    ctx.body = JSON.stringify(user);
});

app.use(router.routes());
app.listen(3000);
