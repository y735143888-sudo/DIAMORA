/* DIAMORA local toast API: toastr-compatible success/info/warning/error methods. */
(function(window, document){
    "use strict";
    var toastr = window.toastr = window.toastr || {};
    toastr.options = {
        closeButton: true,
        progressBar: true,
        timeOut: 5000,
        extendedTimeOut: 1000,
        positionClass: "toast-top-center",
        rtl: true,
        newestOnTop: true
    };

    function getContainer(){
        var container = document.getElementById("toast-container");
        if(!container){
            container = document.createElement("div");
            container.id = "toast-container";
            document.body.appendChild(container);
        }
        return container;
    }

    function show(message, title, type){
        var options = toastr.options || {};
        var container = getContainer();
        var toast = document.createElement("div");
        toast.className = "toast toast-" + type;
        toast.setAttribute("role", "alert");

        if(options.closeButton !== false){
            var close = document.createElement("button");
            close.type = "button";
            close.className = "toast-close-button";
            close.setAttribute("aria-label", "إغلاق");
            close.innerHTML = "&times;";
            close.onclick = function(){ remove(toast); };
            toast.appendChild(close);
        }

        if(title){
            var titleEl = document.createElement("span");
            titleEl.className = "toast-title";
            titleEl.textContent = title;
            toast.appendChild(titleEl);
        }

        var messageEl = document.createElement("span");
        messageEl.className = "toast-message";
        messageEl.textContent = message;
        toast.appendChild(messageEl);

        if(options.progressBar !== false){
            var progress = document.createElement("span");
            progress.className = "toast-progress";
            toast.appendChild(progress);
        }

        if(options.newestOnTop !== false){
            container.insertBefore(toast, container.firstChild);
        }else{
            container.appendChild(toast);
        }

        requestAnimationFrame(function(){
            toast.classList.add("show");
            var progress = toast.querySelector(".toast-progress");
            if(progress){
                progress.style.width = "0%";
            }
        });

        var timeout = Number(options.timeOut) || 0;
        var timer = timeout ? window.setTimeout(function(){ remove(toast); }, timeout) : null;
        toast.addEventListener("mouseenter", function(){
            if(timer){ window.clearTimeout(timer); timer = null; }
        });
        toast.addEventListener("mouseleave", function(){
            if(!timer){
                var extended = Number(options.extendedTimeOut) || 1000;
                timer = window.setTimeout(function(){ remove(toast); }, extended);
            }
        });
        return toast;
    }

    function remove(toast){
        if(!toast || toast.classList.contains("hide")) return;
        toast.classList.remove("show");
        toast.classList.add("hide");
        window.setTimeout(function(){
            if(toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }

    ["success","info","warning","error"].forEach(function(type){
        toastr[type] = function(message, title){
            return show(message, title, type);
        };
    });
})(window, document);
