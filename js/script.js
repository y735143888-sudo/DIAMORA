(function () {
    "use strict";

    function validEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showDiamoraMessage(title, message, type) {
        type = type || "warning";

        if (typeof window.toastr !== "undefined" && typeof window.toastr[type] === "function") {
            window.toastr.options = {
                closeButton: true,
                progressBar: true,
                timeOut: 5000,
                extendedTimeOut: 1000,
                positionClass: "toast-top-center",
                rtl: true,
                newestOnTop: true
            };
            window.toastr[type](message, title);
            return;
        }

        var oldToast = document.querySelector(".diamora-fallback-toast");
        if (oldToast) oldToast.remove();

        var toast = document.createElement("div");
        toast.className = "diamora-fallback-toast";
        toast.setAttribute("role", "alert");
        toast.innerHTML = '<span class="toast-gem">✦</span><div><strong>' + title + '</strong><br><span>' + message + '</span></div>';
        document.body.appendChild(toast);

        window.setTimeout(function () {
            toast.classList.add("hide");
            window.setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 400);
        }, 5000);
    }

    function setupRegisterForm() {
        var form = document.getElementById("registerForm");
        if (!form) return;

        // Prevent the browser's native validation from blocking the custom message.
        form.setAttribute("novalidate", "novalidate");

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();

            var nameEl = document.getElementById("registerName");
            var emailEl = document.getElementById("registerEmail");
            var passwordEl = document.getElementById("registerPassword");
            var confirmEl = document.getElementById("confirmPassword");

            var name = nameEl ? nameEl.value.trim() : "";
            var email = emailEl ? emailEl.value.trim().toLowerCase() : "";
            var password = passwordEl ? passwordEl.value : "";
            var confirmPassword = confirmEl ? confirmEl.value : "";

            if (!name || !email || !password || !confirmPassword) {
                showDiamoraMessage("تنبيه", "يرجى تعبئة جميع الحقول");
                return;
            }
            if (!validEmail(email)) {
                showDiamoraMessage("تنبيه", "يرجى إدخال بريد إلكتروني صحيح");
                return;
            }
            if (password.length < 6) {
                showDiamoraMessage("تنبيه", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
                return;
            }
            if (password !== confirmPassword) {
                showDiamoraMessage("تنبيه", "كلمتا المرور غير متطابقتين");
                return;
            }

            localStorage.setItem("diamoraUser", JSON.stringify({
                name: name,
                email: email,
                password: password
            }));

            showDiamoraMessage("تم إنشاء الحساب بنجاح ✨", "مرحبًا بك في عالم المجوهرات 💎", "success");
            form.reset();
        });
    }

    function setupLoginForm() {
        var form = document.getElementById("loginForm");
        if (!form) return;

        form.setAttribute("novalidate", "novalidate");

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();

            var emailEl = document.getElementById("loginEmail");
            var passwordEl = document.getElementById("loginPassword");
            var email = emailEl ? emailEl.value.trim().toLowerCase() : "";
            var password = passwordEl ? passwordEl.value : "";

            if (!email || !password) {
                showDiamoraMessage("تنبيه", "يرجى تعبئة جميع الحقول");
                return;
            }
            if (!validEmail(email)) {
                showDiamoraMessage("تنبيه", "يرجى إدخال بريد إلكتروني صحيح");
                return;
            }
            if (password.length < 6) {
                showDiamoraMessage("تنبيه", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
                return;
            }

            var savedUser = null;
            try {
                savedUser = JSON.parse(localStorage.getItem("diamoraUser") || "null");
            } catch (error) {
                savedUser = null;
            }

            if (!savedUser) {
                showDiamoraMessage("لم يتم العثور على حساب", "أنشئي حسابًا أولًا ثم سجلي الدخول");
                return;
            }
            if (savedUser.email !== email || savedUser.password !== password) {
                showDiamoraMessage("بيانات الدخول غير صحيحة", "تأكدي من البريد الإلكتروني وكلمة المرور");
                return;
            }

            showDiamoraMessage("تم تسجيل الدخول بنجاح ✨", "مرحبًا بك في عالم المجوهرات، " + savedUser.name + " 💎", "success");
            form.reset();
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupRegisterForm();
        setupLoginForm();

        // The rest of the project uses jQuery. If it is unavailable, the
        // register/login forms above still work normally.
        if (typeof window.jQuery === "undefined") return;

        var $ = window.jQuery;

        $(".product-img button").click(function (event) {
            event.stopPropagation();
            $(this).find("i").toggleClass("fa-regular fa-solid");
        });

        $(".product").click(function () {
            var number = Number($("#cartNumber").text());
            number++;
            $("#cartNumber").text(number);
        });

        $(".ajax-modal-btn").click(function () {
            var file = $(this).data("modal-file");
            var target = $(this).data("modal-target");

            $.ajax({
                url: file,
                method: "GET",
                dataType: "html",
                success: function (data) {
                    $(target).html(data);
                    $(target).modal("show");
                },
                error: function () {
                    $(target).html('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="إغلاق"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">DIAMORA</h4></div><div class="modal-body">تعذر تحميل المحتوى. شغلي المشروع باستخدام Live Server ثم جربي مرة أخرى.</div></div></div>');
                    $(target).modal("show");
                }
            });
        });
    });
})();
