document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".product").forEach(product => {
        const mainImage = product.querySelector(".product-image");
        const thumbnails = product.querySelectorAll(".product-thumbnails img")

        if (!mainImage || thumbnails.length === 0) return;

        const defaultImage = mainImage.dataset.default;

        function switchImage(newSrc) {
            mainImage.style.opacity = 0;

            setTimeout(() => {
                mainImage.src = newSrc;
                mainImage.style.opacity = 1
            }, 150);
        }

        thumbnails.forEach(thumb => {
            thumb.addEventListener("mouseenter", () => {
                switchImage(thumb.src);
            });
            thumb.addEventListener("mouseleave", () => {
                switchImage(thumb.src);
            });
        });
    });
});