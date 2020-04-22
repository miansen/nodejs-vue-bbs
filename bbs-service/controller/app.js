const fs = require('fs');
const path = require('path');
const Koa = require('koa2');
const KoaBody = require('koa-body');
const KoaRouter = require('koa-router');
const Cors = require('@koa/cors');
const send = require('koa-send');

const userService = require('../service/UserService');

const app = new Koa();
app.use(Cors());
app.use(KoaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024
    }
}));

const router = new KoaRouter();

const userJson = path.join(__dirname, 'user.json');
const invitationJson = path.join(__dirname, 'invitation.json');
const settingsJson = path.join(__dirname, 'settings.json');
const tabJson = path.join(__dirname, 'tab.json');
const xxjjJson = path.join(__dirname, 'xxjj.json');

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
    if (!username) {
        error = '用户名为空';
    } else if (!password) {
        error = '密码为空';
    } else {
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
    }
    ctx.body = { code: 200, data, error };
});

router.post('/add_user', async (ctx, next) => {
    const user = ctx.request.body;
    let error = '';
    try {
        userService.save(user);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data: user, error };
});

router.put('/update_user', async (ctx, next) => {
    const user = ctx.request.body;
    let data = '';
    let error = '';
    try {
        userService.update(user);
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
        userService.deleteByUsername(username);
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
        total = userService.count();
        data = userService.list(page, limit);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, total, page, limit, error };
});

router.post('/add_invitation', async (ctx, next) => {
    const invitation = ctx.request.body;
    let data = null, error = '';
    try {
        const text = fs.readFileSync(invitationJson, 'utf-8');
        const invitations = JSON.parse(text);
        invitation.id = Date.now();
        invitations.push(invitation);
        fs.writeFileSync(invitationJson, JSON.stringify(invitations, null, 4));
        data = '发布帖子成功';
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.put('/update_invitation', async (ctx, next) => {
    const invitation = ctx.request.body;
    let data = null, error = '';
    try {
        const text = fs.readFileSync(invitationJson, 'utf-8');
        const invitations = JSON.parse(text);
        const oldInvitation = invitations.find(ele => ele.id === invitation.id);
        if (!oldInvitation) {
            error = '帖子不存在';
        } else {
            delete invitation.id;
            Object.assign(oldInvitation, invitation);
            fs.writeFileSync(invitationJson, JSON.stringify(invitations, null, 4));
            data = '更新帖子成功';
        }
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.post('/search_invitations', async (ctx, next) => {
    const { page, limit, username, keywords, tab } = ctx.request.body;
    let data = null, total = 0, error = '';
    try {
        const settingsText = fs.readFileSync(settingsJson, 'utf-8');
        const settings = JSON.parse(settingsText);
        const topInvitationIds = settings.topInvitationIds;

        const text = fs.readFileSync(invitationJson, 'utf-8');
        const invitations = JSON.parse(text);
        invitations.sort((a, b) => new Date(b.date) - new Date(a.date));
        let matches = invitations;
        matches.forEach(ele => {
            ele.isTop = topInvitationIds.includes(ele.id);
        });
        matches.sort((a, b) => a.isTop ? -1 : 1);
        if (username) {
            matches = matches.filter(ele => {
                return ele.username === username;
            });
        }
        if (keywords) {
            matches = matches.filter(ele => {
                return ele.title.indexOf(keywords) >= 0 || ele.content.indexOf(keywords) >= 0;
            });
        }
        if (tab) {
            matches = matches.filter(ele => {
                return ele.tab === tab;
            });
        }
        total = matches.length;
        data = matches.slice((page - 1) * limit, page * limit);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, total, page, limit, error };
});

router.get('/toggle_top', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = null, error = '';
    try {
        const text = fs.readFileSync(settingsJson, 'utf-8');
        const settings = JSON.parse(text);
        if (settings.topInvitationIds.includes(id)) {
            settings.topInvitationIds = settings.topInvitationIds.filter(ele => ele !== id);
            data = '取消置顶成功';
        } else {
            settings.topInvitationIds.push(id);
            data = '置顶成功';
        }
        fs.writeFileSync(settingsJson, JSON.stringify(settings, null, 4));
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.delete('/delete_invitation', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = null, error = '';
    try {
        const invitationText = fs.readFileSync(invitationJson, 'utf-8');
        const invitations = JSON.parse(invitationText);
        const index = invitations.findIndex(it => it.id === id);
        if (index >= 0) {
            invitations.splice(index, 1);
        }
        fs.writeFileSync(invitationJson, JSON.stringify(invitations, null, 4));
        data = '删除帖子成功';
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});








router.post('/tab/add', async (ctx, next) => {
    const tab = ctx.request.body;
    let data = null;
    let error = '';
    let tabs = [];
    if (!tab.tabName) {
        error = '板块名为空';
    } else {
        try {
            const tabText = fs.readFileSync(tabJson, 'utf-8');
            if (tabText) {
                tabs = JSON.parse(tabText);
            }
            const index = tabs.findIndex(it => it.tabName === tab.tabName);
            if (index >= 0) {
                error = '板块名已存在';
            } else {
                tab.id = Date.now();
                tabs.push(tab);
                fs.writeFileSync(tabJson, JSON.stringify(tabs, null, 4));
                data = "添加板块成功";
            }
        } catch (err) {
            error = err.toString();
        }
    }
    ctx.body = { code: 200, data, error };
});

router.delete('/tab/delete', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = null;
    let error = '';
    let tabs = [];
    try {
        const tabText = fs.readFileSync(tabJson, 'utf-8');
        if (tabText) {
            tabs = JSON.parse(tabText);
        }
        const index = tabs.findIndex(it => it.id === id);
        if (index >= 0) {
            tabs.splice(index, 1);
            fs.writeFileSync(tabJson, JSON.stringify(tabs, null, 4));
            data = '删除板块成功';
        } else {
            error = '板块不存在';
        }
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.put('/tab/update', async (ctx, next) => {
    const tab = ctx.request.body;
    let data = null;
    let error = '';
    let tabs = [];
    try {
        const tabText = fs.readFileSync(tabJson, 'utf-8');
        if (tabText) {
            tabs = JSON.parse(tabText);
        }
        const oldTab = tabs.find(ele => ele.id === tab.id);
        if (!oldTab) {
            error = '板块不存在';
        } else if (oldTab.tabName === tab.tabName) {
            error = '板块名已存在';
        } else {
            delete tab.id;
            Object.assign(oldTab, tab);
            fs.writeFileSync(tabJson, JSON.stringify(tabs, null, 4));
            data = '更新板块成功';
        }
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.post('/tab/list', async (ctx, next) => {
    const { page, limit } = ctx.request.body;
    let data = null;
    let total = 0;
    let error = '';
    let tabs = [];
    try {
        const tabText = fs.readFileSync(tabJson, 'utf-8');
        if (tabText) {
            tabs = JSON.parse(tabText);
        }
        total = tabs.length;
        data = tabs.slice((page - 1) * limit, page * limit);
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, total, page, limit, error };
});

router.get('/xxjj/detail', async (ctx, next) => {
    const id = Number(ctx.query.id);
    let data = null;
    let error = '';
    try {
        const text = fs.readFileSync(xxjjJson, 'utf-8');
        const xxjj = JSON.parse(text);
        if (xxjj.id == id) {
            data = xxjj;
        }
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});

router.put('/xxjj/update', async (ctx, next) => {
    const newXxjj = ctx.request.body;
    let data = null;
    let error = '';
    let oldXxjj = {};
    try {
        const xxjjText = fs.readFileSync(xxjjJson, 'utf-8');
        if (xxjjText) {
            oldXxjj = JSON.parse(xxjjText);
        }
        if (!oldXxjj) {
            error = '对象不存在';
        } else if (newXxjj.id != oldXxjj.id) {
            error = '参数错误';
        } else {
            Object.assign(oldXxjj, newXxjj);
            fs.writeFileSync(xxjjJson, JSON.stringify(newXxjj, null, 4));
            data = '更新成功';
        }
    } catch (err) {
        error = err.toString();
    }
    ctx.body = { code: 200, data, error };
});


router.post('/upload', async (ctx, next) => {
    let data = {};
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, `/upload/${file.name}`);
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
    await send(ctx, fileName, { root: __dirname + '/upload' });
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
