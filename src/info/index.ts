console.log("download");
declare let ZeroClipboard: any;

Array.from(document.querySelectorAll("pre")).forEach(pre => {
    let preClick = new ZeroClipboard(pre);
    preClick.on("aftercopy", function(event) {
      alert("复制成功");
    });
})