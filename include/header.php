<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pratham Vijay Janseva Charitable Trust</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="src/style.css">
  <script src="https://cdn.tailwindcss.com"></script>

</head>
<!-- Top Bar -->
  <div
    class="bg-slate-900 text-slate-200 py-2 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm flex justify-between items-center relative z-50">
    <div class="hidden sm:flex items-center gap-6">
      <a href="tel:+919136974979" class="flex items-center gap-2 hover:text-emerald-400 transition-colors"><i class="fa-solid fa-phone text-emerald-400"></i> +91 91369 74979</a>
      <a href="mailto:pvjtrust@gmail.com" class="flex items-center gap-2 hover:text-emerald-400 transition-colors"><i class="fa-solid fa-envelope text-emerald-400"></i>
        pvjtrust@gmail.com</a>
    </div>
    <div class="flex items-center ml-auto gap-3">
      <!-- <span class="hidden sm:inline font-medium text-slate-300">Translate:</span> -->
      <div id="google_translate_element"></div>
    </div>

  </div>

  <!-- Navbar -->
  <nav id="navbar" class="w-full sticky top-0 z-50 transition-all duration-300 bg-white py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <div class="flex-shrink-0 flex items-center">
          <a href="#home" class="flex items-center gap-2">
            <i class="fa-solid fa-heart text-emerald-600 text-3xl"></i>
            <span class="font-bold text-xl text-slate-800 hidden sm:block">Pratham Vijay Janseva</span>
            <span class="font-bold text-xl text-slate-800 sm:hidden">PVJ Trust</span>
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#home" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Home</a>
          <a href="#about" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">About Us</a>
          <a href="#work" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Our Work</a>
          <a href="#gallery" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Gallery</a>
          <a href="#contact" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Contact</a>
          <a href="#donate"
            class="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-sm">Donate
            Now</a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button id="menu-btn" class="text-slate-600 hover:text-emerald-600 focus:outline-none">
            <i id="menu-icon" class="fa-solid fa-bars text-2xl"></i>
            <i id="close-icon" class="fa-solid fa-xmark text-2xl hidden"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 w-full shadow-lg">
      <!-- <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg mt-2"> -->

      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="#home"
          class="mobile-link block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">Home</a>
        <a href="#about"
          class="mobile-link block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">About
          Us</a>
        <a href="#work"
          class="mobile-link block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">Our
          Work</a>
        <a href="#gallery"
          class="mobile-link block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">Gallery</a>
        <a href="#contact"
          class="mobile-link block px-3 py-2 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">Contact</a>
        <a href="#donate"
          class="mobile-link block px-3 py-2 text-base font-medium text-emerald-600 hover:bg-emerald-50 rounded-md">Donate
          Now</a>
      </div>
    </div>
  </nav>