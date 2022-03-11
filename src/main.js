const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')// $lastLi 表示添加网站的按钮(找出siteList中带有last这个类名的li)
const x = localStorage.getItem('x')// 让变量x接受localStorage里x的值
const xObject = JSON.parse(x)// 将字符串类型转换为对象
const hashMap = xObject || [ // 如果xObject是空的，就给它后面一个初始值,否则就用xObject里的值。localStorage里面没有数据时就给两个基础网站,没有数据时就相当于第一次进入。
    { logo: 'A', url: 'https://www.acfun.cn' },
    { logo: 'B', url: 'https://www.bilibili.com' }
];

// 声明一个简化网址的函数
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '')    //利用正则表达式将/后面的所有字符串替换为空字符串
}

// 封装一个函数render，作用是读取haspMap数据用来创建新网址
const render = () => {
    $siteList.find('li:not(.last)').remove()
    // 找出siteList里面的li(不包括.last类的li)并将其删除，渲染网页的函数大部分都需要先清楚数据，再重新通过遍历添加网页。
    hashMap.forEach((node, index) => {
        // 遍历haspMap数组，node指的是数组里面的每一个对象。主要目的是用哈希数组里面的网址数据来创建每一个li模块，并插入到添加按钮前面。
        const $li =
            $(
                `<li>
                        <div class="site">
                            <div class="logo">${node.logo}</div>
                            <div class="link">${simplifyUrl(node.url)}</div>
                            <div class="close">
                                <svg class="icon">
                                    <use xlink:href="#icon-close"></use>
                                </svg>
                            </div>
                        </div>
                </li>`
            ).insertBefore($lastLi)
        $li.on('click', () => {         // 给每个li绑定点击事件，只要点击li就会打开网页
            window.open(node.url)
        })
        $li.on('click', '.close', (e) => {        // 给每个li里面的close绑定点击事件，点击了li里面的close部分，会删除该网站
            e.stopPropagation(); //阻止冒泡，防止打开网页
            hashMap.splice(index, 1);  //删除网址
            render();
        })
    })
}

render()// 渲染一次网页

$('.addButton')
    .on('click', () => {
        let url = window.prompt('请输入您要添加的网址：');
        if (url.indexOf('http') !== 0) {         // 如果网站不是以http开头的，就增加上https://
            url = 'https://' + url;
        }
        console.log(url)
        console.log($siteList)
        hashMap.push(        // 把需要添加的网址信息储存到haspMap里面
            {
                logo: simplifyUrl(url)[0].toUpperCase(),
                url: url
            }
        )
        render()        // 添加新网址后又渲染一次网页
    })

window.onbeforeunload = () => {        // 离开页面时就将数据储存到localStorage里面
    const string = JSON.stringify(hashMap)    // localStorage只能储存字符串，所以要将hashMap转换为字符串
    localStorage.setItem('x', string)    // 在本地储存中设置一个x，它的值是string
}

$(document).on('keypress', (e) => {
    const { key } = e // const key = e.key的简写;
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key)
            window.open(hashMap[i].url)
    }
})