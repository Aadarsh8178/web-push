const webPush = require("web-push");

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
);

export default (req, res) => {
  console.log(req);
  if (req.method == "POST") {
    const { event,trigger } = req.body;
    switch (trigger.name) {
      case 'USER_ADDED':
        
    }
    webPush
      .sendNotification(
        subscription,
        JSON.stringify({
          title: "Hello Web Push",
          message: "Your web push notification is here!",
        })
      )
      .then((response) => {
        res.writeHead(response.statusCode, response.headers).end(response.body);
      })
      .catch((err) => {
        if ("statusCode" in err) {
          res.writeHead(err.statusCode, err.headers).end(err.body);
        } else {
          console.error(err);
          res.statusCode = 500;
          res.end();
        }
      });
  } else {
    res.statusCode = 405;
    res.end();
  }
};
