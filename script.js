(() => {
  "use strict";

  // Ganti nomor ini jika nomor WhatsApp usaha berubah. Gunakan kode negara tanpa tanda +.
  const WHATSAPP_NUMBER = "6285775551150";

  // Harga di sini adalah estimasi awal dan dapat diedit sesuai kebutuhan usaha.
  const ESTIMATES = {
    hp: { label: "HP", price: 30000 },
    laptop: { label: "Laptop", price: 50000 },
    komputer: { label: "Komputer", price: 50000 }
  };

  const form = document.getElementById("consultForm");
  const deviceType = document.getElementById("deviceType");
  const estimate = document.getElementById("estimate");
  const formError = document.getElementById("formError");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  const formatRupiah = (amount) => new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(amount);

  function updateEstimate() {
    const selected = Object.values(ESTIMATES).find(item => item.label === deviceType.value);
    estimate.value = selected ? `Mulai ${formatRupiah(selected.price)}` : "Pilih perangkat";
  }

  deviceType.addEventListener("change", updateEstimate);

  document.querySelectorAll(".choose-service").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.device;
      const selected = ESTIMATES[key];
      if (!selected) return;
      deviceType.value = selected.label;
      updateEstimate();
      document.getElementById("konsultasi").scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => document.getElementById("brand").focus({ preventScroll: true }), 350);
    });
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
  });

  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu");
  }));

  form.addEventListener("submit", event => {
    event.preventDefault();
    formError.hidden = true;

    if (!form.reportValidity()) return;

    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const model = document.getElementById("model").value.trim();
    const problem = document.getElementById("problem").value.trim();
    const selected = Object.values(ESTIMATES).find(item => item.label === deviceType.value);

    if (!selected || !customerName || !customerPhone || !brand || !model || !problem) {
      formError.textContent = "Mohon lengkapi semua kolom wajib sebelum melanjutkan.";
      formError.hidden = false;
      return;
    }

    // Estimasi disebut sebagai harga awal, bukan tagihan atau biaya final.
    const message = [
      "Halo Hans Service, saya ingin konsultasi servis perangkat.",
      "",
      "DATA PELANGGAN",
      `Nama: ${customerName}`,
      `Nomor HP: ${customerPhone}`,
      "",
      "DETAIL PERANGKAT",
      `Jenis perangkat: ${selected.label}`,
      `Merek: ${brand}`,
      `Model: ${model}`,
      `Estimasi awal di website: Mulai ${formatRupiah(selected.price)} (bukan biaya final)`,
      "",
      "KELUHAN / KERUSAKAN",
      problem,
      "",
      "Mohon informasi pemeriksaan dan estimasi biaya setelah kendala ditinjau. Saya memahami biaya final dapat bergantung pada kerusakan dan suku cadang. Terima kasih."
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    if (!newWindow) {
      // Fallback jika browser memblokir tab baru.
      window.location.href = whatsappUrl;
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  updateEstimate();
})();
