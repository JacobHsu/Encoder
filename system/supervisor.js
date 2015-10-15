process.on('message', loop);

function loop() {
    console.log('supervisor loop');
}
