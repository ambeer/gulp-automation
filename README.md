# gulp-automation
This automation/task runner script helps for component based architecture projects.

Component-based architecture focuses on the decomposition of the design into individual functional or logical components that represent well-defined communication interfaces containing methods, events, and properties.

Example : Lets say if you are developing a webpage into different components like header.html , body.html and footer.html and to build complete webpage we need to include these components by using server side technologies php/jsp as there is no include statement in HTML

like below
```html
//homepage.html
<html>
<head>
    // header component comes here
</head>
<body>
  // body component comes here
  // footer component comes here
</body>
</html>
```

By using this task runner, you can directly load your components (html, css and js) with out need any server technology. 

Below is the usage of this script

```html
//homepage.html
<html>
<head>
    {{ header.html }}
</head>
<body>
  {{ body.html }}
  {{ footer.html }}
</body>
</html>

```





