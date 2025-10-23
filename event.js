const EventEmitter = require('node:events');
// Creer une instance de l'EventEmitter
const eventEmitter = new EventEmitter();
// Mettre en ecoute l'eventemitter sur l'event "data"
eventEmitter.on('d', (data) => {
    console.log('Data received:', data);
});
// Emettre l'event "data" avec une charge utile
setInterval( () => {
    eventEmitter.emit('d', new Date());
}, 2000);