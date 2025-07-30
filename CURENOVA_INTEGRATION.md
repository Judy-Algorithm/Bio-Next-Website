# CureNova与Bio-Next集成指南

## 问题描述

用户在CureNova网站上已登录，但点击"Try Now"跳转到Bio-Next应用后，无法自动获取登录状态。

## 解决方案

### 1. 修改CureNova网站的"Try Now"按钮

在CureNova网站中，需要修改"Try Now"按钮的跳转逻辑：

```javascript
// 在CureNova网站中添加这个函数
function redirectToBioNext() {
  // 获取当前登录用户信息
  const currentUser = getCurrentUser(); // 从CureNova的认证系统获取
  const authToken = getAuthToken(); // 获取认证token
  
  if (currentUser && authToken) {
    // 构建跳转URL，包含用户信息
    const userData = encodeURIComponent(JSON.stringify(currentUser));
    const bioNextUrl = `https://bio-next-website.vercel.app/?auth_token=${authToken}&user_data=${userData}`;
    
    // 跳转到Bio-Next
    window.open(bioNextUrl, '_blank');
  } else {
    // 如果用户未登录，跳转到登录页面
    window.open('https://bio-next-website.vercel.app/', '_blank');
  }
}

// 修改"Try Now"按钮的onClick事件
document.getElementById('try-now-button').onclick = redirectToBioNext;
```

### 2. 用户信息格式

CureNova需要传递的用户信息格式：

```javascript
const currentUser = {
  id: "user_id",
  name: "用户名",
  email: "user@example.com",
  avatar: "https://example.com/avatar.jpg", // 可选
  role: "user" // 可选
};
```

### 3. Bio-Next应用的处理

Bio-Next应用已经配置了接收这些参数：

```typescript
// 在store/auth.ts中已经实现
const urlParams = new URLSearchParams(window.location.search)
const authToken = urlParams.get('auth_token')
const userData = urlParams.get('user_data')

if (authToken && userData) {
  const user = JSON.parse(decodeURIComponent(userData))
  // 存储用户信息
  localStorage.setItem('auth-token', authToken)
  localStorage.setItem('curenova-user', JSON.stringify(user))
}
```

## 实施步骤

### 步骤1: 修改CureNova网站

1. **找到"Try Now"按钮**
   - 在CureNova网站的Product页面
   - 按钮文本："Try Now →"

2. **添加跳转逻辑**
   ```html
   <button onclick="redirectToBioNext()" class="try-now-button">
     Try Now →
   </button>
   ```

3. **添加JavaScript函数**
   ```javascript
   function redirectToBioNext() {
     // 获取当前用户信息
     const currentUser = {
       id: "current_user_id",
       name: "当前用户名",
       email: "current_user@example.com",
       avatar: "用户头像URL"
     };
     
     const authToken = "current_auth_token";
     
     // 构建跳转URL
     const userData = encodeURIComponent(JSON.stringify(currentUser));
     const bioNextUrl = `https://bio-next-website.vercel.app/?auth_token=${authToken}&user_data=${userData}`;
     
     // 跳转
     window.open(bioNextUrl, '_blank');
   }
   ```

### 步骤2: 测试集成

1. **在CureNova网站登录**
2. **点击"Try Now"按钮**
3. **验证Bio-Next应用是否自动登录**

## 备选方案

### 方案1: 使用localStorage共享

如果两个网站在同一域名下，可以使用localStorage共享：

```javascript
// 在CureNova中存储用户信息
localStorage.setItem('shared-user', JSON.stringify(currentUser));

// 在Bio-Next中读取
const sharedUser = localStorage.getItem('shared-user');
```

### 方案2: 使用postMessage

```javascript
// 在CureNova中
window.open('https://bio-next-website.vercel.app/', '_blank');

// 在Bio-Next中监听消息
window.addEventListener('message', (event) => {
  if (event.origin === 'https://cure-nova-website.vercel.app') {
    const userData = event.data;
    // 处理用户数据
  }
});
```

## 安全考虑

1. **验证token有效性**
2. **检查域名来源**
3. **加密敏感数据**
4. **设置token过期时间**

## 调试步骤

1. **检查URL参数**
   - 打开浏览器开发者工具
   - 查看Bio-Next应用的URL是否包含auth_token和user_data

2. **检查localStorage**
   - 在Bio-Next应用中检查localStorage
   - 确认用户信息是否正确存储

3. **检查认证状态**
   - 查看Bio-Next应用的认证状态
   - 确认用户是否已登录

## 联系信息

如果需要修改CureNova网站，请联系CureNova的开发团队实施上述集成方案。 