### 1.http报文头部有哪些字段? 有什么意义 ?

Accept
表示客户端期望服务器返回的媒体格式。客户端期望的资源类型服务器可能没有，所以客户端会期望多种类型，并且设置优先级，服务器根据优先级寻找相应的资源返回给客户端。
```
注意：先逗号分割类型，再分号分割属性
Accept: audio/*; q=0.2, audio/basic
```
表示 audio/basic 类型的资源优先，如果没有，就随便其它什么格式的 audio 资源都可以。q 的取值范围是(0-1]，其具体值并没有意义，它仅用来排序优先级，如果没有 q，默认 q=1，也就是最高优先级。

Accept-Charset
表示客户端期望服务器返回的内容的编码格式。它同 Accept 头一样，也可以指定多个编码，以 q 值代表优先级。
```
 注意：先逗号分割类型，再分号分割属性
Accept-Charset: utf8, gbk; q=0.6
表示 utf8 编码优先，如果不行，就拿 gbk 编码返回.
```
Content-Type
Content-Type 是服务器向客户端发送的头，代表内容的媒体类型和编码格式，是对 Accept 头和 Accept-Charset 头的统一应答。
```
Content-Type: text/html; charset=utf8
表示返回的 Body 是个 html 文本，编码为 utf8

```

Accept-Language
表示客户端期望服务器返回的内容的语言。很多大型互联网公司是全球化的，它的技术文档一般有有多种语言，通过这个字段可以实现文档的本地化，对国内用户呈现简体中文文档，对英语系用户呈现英文文档。
```
Accept-Language:zh-CN,en-US;q=0.8,zh-TW;q=0.6
表示大陆简体中文优先，其次英语，再其次台湾繁体中文
```
Content-Language
这个头字段内容是对 Accept-Language 的应答。服务器通过此字段告知客户端返回的 Body 信息的语言是什么。



Content-Length
表示传输的请求／响应的 Body 的长度。GET 请求因为没有 Body，所以不需要这个头。携带 Body 的并且可以提前知道 Body 长度的请求／响应必须带上这个字段，以便对方可以方便的分辨出报文的边界，也就是 Body 数据何时结束。如果 Body 太大，需要边计算边传输，不到最后计算结束是无法知道整个 Body 大小的，这个时候可以使用 http 分块传输，这个时候也是不需要 Content-Length 字段的。

Content-Location
当客户端请求的资源在服务器有多个地址时，服务器可以通过 Content-Location 字段告知客户端其它的可选地址。这个字段比较少见。

Content-MD5
在 Header 中提供这个信息是用来做 Body 内容校验。它表示 Body 信息被 md5 算法处理后的 base64 字符串。这个字段也比较少见。因为校验机制在 TCP 层已经有实现了，再来一层校验并没有多大意义。另外资源的 md5 值往往用来放在后面的 ETag 头信息中作为资源的唯一标识来使用。

Date
如果服务器没有缓存，那么 Date 就是响应的即时生成时间。如果服务器设有缓存，那么 Date 就是响应内容被缓存的时间。它必须符合规范里定义的特定格式，这种格式叫着 HTTP-Date，不支持随意定义自己的时间格式。

Date: Tue, 15 Nov 1994 08:12:31 GMT
Age
表示资源缓存的年龄，也就是资源自缓存以来到现在已经过去了多少时间，单位是秒。

Age: 86400
Expires
服务器使用 Expect 头来告知对方资源何时失效。如果它的值等于 Date 头的值，就表示资源已经实效。

Expires: Thu, 01 Dec 1994 16:00:00 GMT
ETag
资源标签，每个资源可以提供多个标签信息。它一般用来和下面的 If-Match 和 If-None-Match 配合使用，用来判断缓存资源的有效性。比较常见的标签是资源的版本号，比如可以拿资源数据的 md5 校验码作为版本号。

If-Match
If-Match 的值一般是上面提到的 ETag 的值，它常用于 HTTP 的乐观锁。所谓 HTTP 乐观锁，是指客户端先 GET 这个资源得到 ETag 中的版本号，然后发起一个资源修改请求 PUT|PATCH 时通过 If-Match 头来指定资源的版本号，如果服务器资源满足 If-Match 中指定的版本号，请求就会被执行。如果不满足，说明资源被并发修改了，就需要返回状态码为 412 Precondition failed 的错误。客户端可以选择放弃或者重试整个过程。

If-None-Match
类似于 If-Match，只是条件相反。



Allow
表示资源支持访问的 HTTP Method 类型。它是服务器对客户端的建议，告知对方请使用 Allow 中提到的 Method 来访问资源。

Allow: GET, HEAD, PUT
Connection
当客户端和服务器需要协商连接的属性时，可以使用 Connection 头部。比较常用的一个值是 close，用来通知对方在当前请求结束后关闭连接。

Connection: close
Expect
用于请求发送之前向服务器询问许可。譬如要向服务器发送一个很大的文件而不确定是否超出限制，就可以在请求头里携带一个 Expect 头部

Expect: 100-continue
如果服务器说不行，就会返回 417 Expectation Failed 错误告知客户端放弃。如果可以那就返回 100 continue 状态码告知客户端放马过来吧，于是客户端就会继续上传 Body 内容。如果服务器提前收到 Body 内容就会放弃返回 100 continue 响应。

From
该字段一般用来标记请求发起者的邮件地址，相当于给请求赋予一个责任人。如果服务器发现请求存在问题，就会通过此字段联系到发起人进行处理。因为邮件地址涉及到隐私信息，所以请求携带 From 头需要征得用户的同意。RFC 协议建议所有的机器人代理发起的请求应该携带此头部，以免遇到问题时可以找到责任人。不过如果是恶意的机器人，估计这样的建议也只是耳边风而已。

Host
RFC 协议规定所有的 HTTP 请求必须携带 Host 头，即使 Host 没有值，也必须带上这个 Host 头附加一个空串，如果不满足，应用服务器应该抛出 400 Bad Request。协议虽然这样规定，不过大部分网关或者服务器都比较仁慈，既然没有指定 Host 字段，那就给你默认加上一个。 网关代理可以根据不同的 Host 值转发到不同的 upstream 服务节点，它常用于虚拟主机服务业务。



Last-Modified
标记资源的最近修改时间，它和 Date 比较类似，区别是 Last-Modified 代表修改时间，而 Date 是创建时间。

If-Modified-Since
浏览器向服务器请求静态资源时，如果浏览器本地已经有了缓存，就会携带 If-Modified-Since 头，值为资源的 Last-Modified 时间，询问服务器该资源自从这个 Last-Modified 时间之后有没有被修改。如果没有修改过，就会向浏览器返回 304 Not Modified 通知浏览器可以放心使用缓存内的资源。如果资源修改过，那就像正常的 GET 请求一样，携带资源的内容返回 200 OK。

If-Unmodified-Since
类似于 If-Modified-Since，意义相反。区别是当服务器资源条件不满足时，不是返回 304 Not Modified，而是返回 412 Precondition Failed。



Range
支持断点续传的服务器必须处理 Range 头，它表示客户端请求资源的一部分时指定的请求字节范围。它是客户端向服务器发送的请求头。

Range: bytes=500-999
Content-Range
针对上面的 Range 头，服务器响应客户端时也需提供相应的 Content-Range 头，表示传输的 Body 数据在整体资源块中的字节范围。比如下面的例子表示该资源总共有 47022 字节，当前响应的内容是 21010-47021 字节之间的内容。

Content-Range: bytes 21010-47021/47022
之所以是 47021 而不是 47022 是因为 offset 是以 0 开始的，47021 就是最后一个字节。

If-Range
在断点续传时，为确保连续 2 个请求之间服务器资源本身没有发生变化，需要 If-Range 头带上 ETag 的资源版本号。服务器资源根据这个版本号来判定资源是否改变了。如果没变，就返回 206 Partial Content 将部分资源返回。如果资源变了，那就相当于一个普通的 GET 请求，返回 200 OK 和整个资源内容。



Location
服务器向客户端发送 302 跳转的时候，总会携带 Location 头信息，它的值为目标 URL。

HTTP/1.1 302 Temporary Redirect
Location: https://www-temp.example.org/
Max-Forwards
用来限定网关或者代理的层数，也就是最大转发次数。HTTP 每经过一个网关或者代理层，Max-Forwards 值就要减 1。如果 nginx 接收到前端请求的时候 Max-Forwards 已经等于 0，那么它就不应该再将请求转发到 upstream 指定的服务节点上。

Pragma
这个头是比较常见的，在前端开发模式下经常会加上这个头部。

Pragma: no-cache
当网关收到一个带有这样请求的头部时，即使内部存在该请求资源的缓存并且有效也不可以直接发送给客户端，而必须转发给后面的 upstream 进行处理。 不过如果真的所有的网关都遵循这个协议的话，攻击是很容易构造的，所以它一般仅用于开发模式，防止静态资源修改后前端得不到即时更新。其它值的 pragma 值没有遇到过。

Referer
Referer 是非常常用的头，它表示请求的发起来源 URI，也就是当前页面资源的父页面。如果你从 A 页面跳转到 B 页面，那么请求 B 页面的请求头里面就会有 Referer 信息，它的值就是 A 页面的访问地址。通过追踪 Referer，可得出资源页面之间复杂的跳转链，它非常适合用于网页的数据分析和路径优化。



Retry-After
服务器升级时，来自客户端的请求会直接给予 503(Service Unavailable)错误，通过在返回头里面加入 Retry-After 字段告知客户端何时服务可以恢复正常访问。Retry-After 的头可以是 HTTP-Date，也可以是整数，表示多少秒后服务可以恢复正常访问。浏览器在拿到这个值之后可以考虑增加一个定时器在未来的某个时间进行重试。

Server
用于返回服务器相关的软件信息，来告知客户端当前的 HTTP 服务是由某某软件提供的，可以看成是一种软件广告。 RFC 协议里对这个头信息做了警告：暴露出服务器信息可能会导致黑客更易于攻击你的服务，建议谨慎使用。

User-Agent
携带当前的用户代理信息，一般包含浏览器、浏览器内核和操作系统的版本型号信息。它和 Server 头是对应的，一个是表达服务器信息，一个是表达客户端信息。服务器可以根据用户代理信息统计出网页服务的浏览器、操作系统的使用占比情况，服务器也可以根据 UA 的信息来定制不一样的内容。



Transfer-Encoding
传送 Body 信息时需要对 Body 数据采取何种变换。当 HTTP 对 Body 进行分块传送时，需要增加下面的头部信息才可以进行分块传送。其它类型目前没有遇到过。

Transfer-Encoding: chunked
Upgrade
服务器建议客户端升级传输协议。比如当客户端使用 HTTP/1.0 发送请求时，服务器就可以建议客户端升级到 HTTP/1.1。 这个时候就可以使用 Upgrade 头。客户端收到这个 Upgrade 后就会将后续请求转成 HTTP/1.1 格式继续进行交流。可以支持多个参数，使用逗号分割即可。

Upgrade: HTTP/1.1
当客户端要和服务器进行 Websocket 进行通讯时，在握手阶段服务器也会向客户端发送 Upgrade 头部信息，提示客户端将协议切换到 Websocket。

Upgrade: WebSocket
Vary
该头部用于缓存控制。对于一些缓存服务器，我们在请求里加入 Vary 参数可以告知缓存服务器对不同的 Vary 参数的响应使用不同的缓存单元。比如 Vary 参数里放入编码参数，那么不同编码的网页就会有不同的缓存。Vary 的值可以有多个，只要任意一个值不一样就会有不同的缓存。 比如下面的这个例子告知缓存服务器对不同语言和不同编码的网页响应使用不同的缓存单元。

Vary: Accept-Encoding,Accept-Language
Via
该字段用来标识一个请求经过的网关路由节点。如果这个请求经过了多个代理层，Via 头部就会有多个网关信息。

Warning
用于在响应中添加一些附加的警告信息，警告信息包含一个错误码和错误说明。通用的一些错误码在 RFC 协议中有具体规定。比如 111 号错误码表示缓存服务器的缓存项目已经过期，并且尝试 reload 资源，但是 reload 失败了，所以只好返回了旧的已经过期的内容，这个时候就需要通过 warning 头反馈客户端。

Warning: 111 Revalidation failed
WWW-Authenticate
WWW-Authenticate 是 401 Unauthorized 错误码返回时必须携带的头，该头会携带一个问题 Challenge 给客户端，告知客户端需要携带这个问题的答案来请求服务器才可以继续访问目标资源。这种问题 Challenge 可以自定义，比较常见的是 Basic 认证。

WWW-Authenticate: Basic realm=xxx
Basic 指代 base64 加密算法(不安全)，realm 指代认证范围 /场合 /情景名称。

Authorization
对于某些需要特殊权限才能访问的资源需要客户端在请求里提供用户名密码的认证信息。它是对 WWW-Authenticate 的应答。

value = base64(user_name:password)
Authorization: Basic YWRtaW46YWRtaW4xMjM=


Proxy-Authenticate
同 WWW-Authorization 头部，用于代理服务器认证。

Proxy-Authorization
同 Authorization 头部，用于代理服务器认证。

ETag vs Last-Modified vs Expires
ETag 一般携带的是资源的版本号，协议没有具体规定版本号是什么。它可以是资源的 md5 校验码，也可以是 uuid，甚至可以是自增的数字，也可以是资源的修改时间。它的匹配方式是相等 /不相等。因为服务器需要维护版本号，取决的版本号是什么，这可能是一个存储和计算的负担。

Last-Modified 携带的资源的修改时间。它的匹配方式是大于 /小于。如果是静态资源文件，一般就是操作系统记录的文件修改时间。

Expires 是服务器告知客户端资源的过期时间。客户端缓存的资源在这个时间之后自动过期，而不需要非得向服务器确认一下是不是 304 Not Modified 才认为没过期。

Cache-Control
这可能是 HTTP 头里面最复杂的一个头了。这个头既可以用于请求，也可以用于响应。在请求和响应的取值不一样，分别代表了不同的意思。

no-cache 如果 no-cache 没有指定值，那就表示不允许缓存。对于请求来说，服务器不得使用缓存内容直接返回。对于响应来说，客户端不得缓存响应的资源内容。如果 no-cache 指定了值，那就表示值对应的头信息不得使用缓存，其它的信息还是可以缓存的。告知对方我只要新鲜刚出浴的数据。
no-store 告知对方不要持久化请求 /响应数据到其它地方，这种信息是敏感的，要保持它的易失性。告知对方记在心里(memory)就行，别写在纸上(disk)。
no-transform 告知对方不要转换数据。比如客户端上传了 raw 图像数据，服务器一般都会选择性压缩图像数据进行存储。no-transform 告知对方保留原始数据信息，不要进行任何转换。告知对方不要乱动我发过来的东西。
only-if-cached 用于请求头，告知服务器只要那些已经缓存的内容，不要去 reload。如果没有缓存内容就返回 504 Gateway Timeout 错误。表示客户端不想太麻烦服务器，有就给，没就算了。
max-age 用于请求头。限制缓存内容的年龄，如果超过 max-age 年龄的，需要服务器去 reload 内容资源。这叫客户端的年龄歧视。
max-stale 用于请求头。客户端允许服务器返回缓存已过期的资源内容，但是限定了最大过期时间。表示客户端虽然很宽容，那是也是有限度的。
min-fresh 用于请求头。客户端限制服务器不要那些即将过期的资源内容。就好比我们去超市买牛奶，如果牛奶快过期了虽然还在保质期内咱们也就不会考虑。
public 用于响应头。表示允许客户端缓存响应信息，并可以给别人使用。比如代理服务器缓存静态资源供所有代理用户使用。
private 用于响应头。表示仅允许客户端缓存响应信息给自己使用，不得分享给别人。这样是为了禁止代理服务器进行缓存，而允许客户端自己缓存资源内容。意思是你个人留着用就行，别借给别人用。

___
请求头（Request）：
Accept：text/html application/xml 告诉服务器客户端浏览器这边可以出里什么数据；
Accept-Encodeing：gzip 告诉服务器我能支持什么样的压缩格式
accept-language：告诉服务器浏览器支持的语言
Cache-control：告诉服务器是否缓存
Connection:keep-alive 告诉服务器当前保持活跃（与服务器处于链接状态）
Host：远程服务器的域名
User-agent：客户端的一些信息，浏览器信息 版本
referer：当前页面上一个页面地址。一般用于服务器判断是否为同一个域名下的请求

返回头（response-header）：
cache-control:private/no-cache; 私有的不需要缓存/no-cache也不需要缓存
connection:keep-live; 服务器同意保持连接
content-Enconding：gzip；除去头的剩余部分压缩返回格式
content-length:内容长度
content-type：text/css;返回内容支持格式
Date： 时间
server：ngnix 服务器类型
set-Cookie:服务器向客户端设置cookie 第一次访问服务器会下发cookie当作身份认证信息，第二次访问服务器再把cookie送给服务器，可以当作认证信息
last-modified: 时间戳 文档的最后改动时间。客户可以通过If-Modified-Since请求头提供一个日期，该请求将被视为一个条件GET，只有改动时间迟于指定时间的文档才会返回，否则返回一个304(Not Modified)状态。Last-Modified也可用setDateHeader方法来设置。
expires 告诉浏览器把回送的资源缓存多长时间 -1或0则是不缓存
etag:版本专有的加密指纹。（有的网站不用，并非必须）优先检查etag再检查last-modified的时间戳。向服务器请求带if-none-match,服务器判断是否过期未过期返回304，过期返回200
// 注释：第一次请求出来的数据先进行缓存协商，是否缓存expires，cache-control 缓存时间，etag，last-modified等
//注释：多次访问的时候，浏览器先判断是否有缓存，是否过期
//未过期：直接从缓存中读取。

//http状态码
//1.指示信息–表示请求已经接受，继续处理
//2.成功–表示请求已经被成功接受，理解
//3.重定向–表示完成请求必须进行更进一步操作
//4.客户端错误–请求有语法错误或者请求无法实现
//5.服务器端错误–服务器未能实现合法的请求


### 2. http code码?
	简单版  

  		100  Continue	继续，一般在发送post请求时，已发送了http header之后服务端将返回此信息，表示确认，之后发送具体参数信息  

  		200  OK 		正常返回信息  
  		201  Created  	请求成功并且服务器创建了新的资源  
  		202  Accepted 	服务器已接受请求，但尚未处理  

  		301  Moved Permanently  请求的网页已永久移动到新位置。  
  		302 Found  		临时性重定向。  
  		303 See Other  	临时性重定向，且总是使用 GET 请求新的 URI。  
  		304  Not Modified 自从上次请求后，请求的网页未修改过。  

  		400 Bad Request  服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。
  		401 Unauthorized 请求未授权。
  		403 Forbidden  	禁止访问。
  		404 Not Found  	找不到如何与 URI 相匹配的资源。

  		500 Internal Server Error  最常见的服务器端错误。
  		503 Service Unavailable 服务器端暂时无法处理请求（可能是过载或维护）。
  	

    完整版


        1**(信息类)：表示接收到请求并且继续处理  
        100——客户必须继续发出请求  
        101——客户要求服务器根据请求转换HTTP协议版本  

        2**(响应成功)：表示动作被成功接收、理解和接受  
        200——表明该请求被成功地完成，所请求的资源发送回客户端  
        201——提示知道新文件的URL  
        202——接受和处理、但处理未完成  
        203——返回信息不确定或不完整   
        204——请求收到，但返回信息为空  
        205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件   
        206——服务器已经完成了部分用户的GET请求

        3**(重定向类)：为了完成指定的动作，必须接受进一步处理  
        300——请求的资源可在多处得到  
        301——本网页被永久性转移到另一个URL   
        302——请求的网页被转移到一个新的地址，但客户访问仍继续通过原始URL地址，重定向，新的URL会在response中的Location中返回，浏览器将会使用新的URL发出新的Request。  
        303——建议客户访问其他URL或访问方式  
        304——自从上次请求后，请求的网页未修改过，服务器返回此响应时，不会返回网页内容，代表上次的文档已经被缓存了，还可以继续使用  
        305——请求的资源必须从服务器指定的地址得到  
        306——前一版本HTTP中使用的代码，现行版本中不再使用  
        307——申明请求的资源临时性删除

        4**(客户端错误类)：请求包含错误语法或不能正确执行  
        400——客户端请求有语法错误，不能被服务器所理解  
        401——请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用  
        HTTP 401.1 - 未授权：登录失败  
        　　HTTP 401.2 - 未授权：服务器配置问题导致登录失败  
        　　HTTP 401.3 - ACL 禁止访问资源  
        　　HTTP 401.4 - 未授权：授权被筛选器拒绝  
        HTTP 401.5 - 未授权：ISAPI 或 CGI 授权失败  
        402——保留有效ChargeTo头响应  
        403——禁止访问，服务器收到请求，但是拒绝提供服务  
        HTTP 403.1 禁止访问：禁止可执行访问  
        　　HTTP 403.2 - 禁止访问：禁止读访问  
        　　HTTP 403.3 - 禁止访问：禁止写访问  
        　　HTTP 403.4 - 禁止访问：要求 SSL  
        　　HTTP 403.5 - 禁止访问：要求 SSL 128  
        　　HTTP 403.6 - 禁止访问：IP 地址被拒绝  
        　　HTTP 403.7 - 禁止访问：要求客户证书  
        　　HTTP 403.8 - 禁止访问：禁止站点访问  
        　　HTTP 403.9 - 禁止访问：连接的用户过多  
        　　HTTP 403.10 - 禁止访问：配置无效  
        　　HTTP 403.11 - 禁止访问：密码更改  
        　　HTTP 403.12 - 禁止访问：映射器拒绝访问  
        　　HTTP 403.13 - 禁止访问：客户证书已被吊销  
        　　HTTP 403.15 - 禁止访问：客户访问许可过多   
        　　HTTP 403.16 - 禁止访问：客户证书不可信或者无效   
        HTTP 403.17 - 禁止访问：客户证书已经到期或者尚未生效   
        404——一个404错误表明可连接服务器，但服务器无法取得所请求的网页，请求资源不存在。eg：输入了错误的URL  
        405——用户在Request-Line字段定义的方法不允许  
        406——根据用户发送的Accept拖，请求资源不可访问  
        407——类似401，用户必须首先在代理服务器上得到授权  
        408——客户端没有在用户指定的饿时间内完成请求  
        409——对当前资源状态，请求不能完成  
        410——服务器上不再有此资源且无进一步的参考地址  
        411——服务器拒绝用户定义的Content-Length属性请求  
        412——一个或多个请求头字段在当前请求中错误   
        413——请求的资源大于服务器允许的大小  
        414——请求的资源URL长于服务器允许的长度  
        415——请求资源不支持请求项目格式  
        416——请求中包含Range请求头字段，在当前请求资源范围内没有range指示值，请求也不包含If-Range请求头字段  
        417——服务器不满足请求Expect头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求长。   

        5**(服务端错误类)：服务器不能正确执行一个正确的请求  
        HTTP 500 - 服务器遇到错误，无法完成请求  
        　　HTTP 500.100 - 内部服务器错误 - ASP 错误  
        　　HTTP 500-11 服务器关闭  
        　　HTTP 500-12 应用程序重新启动  
        　　HTTP 500-13 - 服务器太忙  
        　　HTTP 500-14 - 应用程序无效  
        　　HTTP 500-15 - 不允许请求 global.asa  
        　　Error 501 - 未实现  
        HTTP 502 - 网关错误   
        HTTP 503：由于超载或停机维护，服务器目前无法使用，一段时间后可能恢复正常  

###3. TCP的三次握手与四次挥手（详解+动图）  
 [参考](https://blog.csdn.net/qzcsu/article/details/72861891)  

>  “三次握手”的过程是，发送端先发送一个带有SYN（synchronize）标志的数据包给接收端，在一定的延迟时间内等待接收的回复。接收端收到数据包后，传回一个带有SYN/ACK标志的数据包以示传达确认信息。接收方收到后再发送一个带有ACK标志的数据包给接收端以示握手成功。在这个过程中，如果发送端在规定延迟时间内没有收到回复则默认接收方没有收到请求，而再次发送，直到收到回复为止
> 
    三次握手  
        client -> server   SYN = 1,seq = x;  
        server -> client   SYN = 1,ACK=1,seq= y,ack=x+1;  
        client -> sever    ACK=1, seq = x+1,ack=y+1;    
        数据传输

    四次挥手  
        client -> server FIN = 1,seq =u;  
        server -> client ACK=1,seq=v,ack=u+1;  
        传输数据  
        server -> client FIN=1,ACK=1,seq=w,ack=u+1;   
        client -> server ACK=1,seq=u+1.ack=w+1;  
[http传输过程超详解](https://www.cnblogs.com/kongxy/p/4615226.html) 

### 4. 网络通信
  >互联网内各网络设备间的通信都遵循TCP/IP协议，利用TCP/IP协议族进行网络通信时，会通过分层顺序与对方进行通信。分层由高到低分别为：应用层、传输层、网络层、数据链路层。发送端从应用层往下走，接收端从数据链路层网上走。如图所示：  
  
 ![五层网络](../img/network.png)

### 5. https与http有什么区别和联系?  
[https与http的区别和联系,以及加密的原理,过程,https的优缺点](https://blog.csdn.net/xionghuixionghui/article/details/68569282)  
[HTTPS握手](https://blog.csdn.net/hherima/article/details/52469674)  
[https握手证书验证](https://blog.csdn.net/sunansheng/article/details/78581468)

### 6. http1.0, http1.1, http2.0的区别?     
    [参考](https://www.cnblogs.com/heluan/p/8620312.html)   
    [http2.0的优劣](https://blog.csdn.net/u012657197/article/details/77877840)  
    [http2.0](https://blog.csdn.net/u012657197/article/details/77877840)  


### 7. 认识http的基本信息.  
 [重点参考链接,](http://www.cnblogs.com/ranyonsue/p/5984001.html)  
 [http详解搜索百度](https://blog.csdn.net/u013219814/article/details/56290792)  



###4. 静态文件的浏览器缓存如何实现?

[http缓存](https://www.cnblogs.com/chenqf/p/6386163.html)  
[详解http缓存字段](https://www.cnblogs.com/shangxiaofei/p/6214560.html)  
[HTTP 缓存的四种风味与缓存策略](https://segmentfault.com/a/1190000006689795)


# 参考链接
[http](https://baike.baidu.com/item/http/243074?fr=aladdin)