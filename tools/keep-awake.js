const fetch = require('node-fetch');

function poke() {
    fetch('https://ethermine-api.herokuapp.com/stats?limit=1')
        .then(res => res.json())
        .then(json => {
            console.log('\n\n');
            console.log(json);
            console.log('------' + new Date() + '------');
        });
}

poke();

setInterval(() => {
    poke();
}, 1000 * 60 * 15);