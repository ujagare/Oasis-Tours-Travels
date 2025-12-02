// Defer Tawk.to chat widget to load after page is fully loaded
window.addEventListener('load', function() {
    setTimeout(function() {
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/68cbdd63a237bc19238abc94/1j5e5hjlv';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
        })();
    }, 3000); // Load after 3 seconds
});
