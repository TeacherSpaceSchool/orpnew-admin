self.addEventListener('push', function (event) {
    let _data = event.data ?
        event.data.json()
        :
        {title: 'ORP-SHORO', message: 'Не забудьте заполнить накладную', tag: 'ORP-SHORO', url: 'https://orp-shoro.site', icon: 'https://orp-shoro.site/static/192x192.png'};
    event.waitUntil(
        self.registration.showNotification(_data.title, {
            badge: 'https://orp-shoro.site/static/192x192.png',
            body: _data.message,
            icon: _data.icon,
            tag: _data.tag,
            silent: false,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data: _data
        })
    );
});