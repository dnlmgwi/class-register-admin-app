<script>
  import image from "$lib/assets/family_love/family_love_4x.webp";
  import logo from "$lib/assets/images/coat_of_arms_of_malawi.webp";
</script>

<div class="flex flex-col min-h-[100dvh]">
  <header class="px-4 lg:px-6 h-14 flex items-center">
    <a class="flex items-center gap-2 font-semibold" href="/" rel="ugc">
      <img alt="logo" src={logo} class="w-8" />
      <span>NACIT Hub</span>
    </a>
    <nav class="ml-auto gap-4 sm:gap-6 flex items-center justify-center">
      <a
        class="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 text-gray-50 hover:text-gray-50 px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-gray-950 hover:bg-gray-800 focus-visible:ring-gray-300"
        href="/auth"
      >
        Login
      </a>
    </nav>
  </header>

  <main class="flex-1 h-screen justify-center content-center">
    <section class="w-full py-12 md:pt-24 lg:pt-32 items-center">
      <div class="px-4 md:px-6 space-y-10 xl:space-y-16">
        <div
          class="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16"
        >
          <div>
            <h1
              class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] py-2"
            >
              In Class. In Touch
            </h1>
            <p class="mx-auto max-w-[700px] text-gray-500 md:text-x">
              Our solution helps you stay in class and improve your performance.
            </p>
            <div class="space-x-4 mt-6">
              <a
                class="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-gray-900/90 hover:text-gray-50 focus-visible:outline-none focus-visible:ring-1disabled:pointer-events-none disabled:opacity-50 bg-gray-50 text-gray-900 focus-visible:ring-gray-300"
                href="/auth/signup"
              >
                Sign Up
              </a>
              <a
                class="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 text-gray-50 hover:text-gray-50 px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-gray-950 hover:bg-gray-800 focus-visible:ring-gray-300"
                href="/"
              >
                Learn More
              </a>
            </div>
          </div>

          <div class="flex flex-col items-start space-y-4">
            <!-- <img
              src={image}
              width="1270"
              height="300"
              alt="Hero"
              class="mx-auto overflow-hidden rounded-t-xl object-cover"
            /> -->
          </div>
        </div>
        <p class="mx-auto max-w-[700px] text-gray-500 md:text-x">
          Disclaimer: This is not an official malawi government Application.
          Logo use is for testing purposes only. all rights reserved.
        </p>
      </div>
    </section>
  </main>
  <footer
    class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"
  >
    <p class="text-xs text-gray-500">© 2024 NACIT Hub. All rights reserved.</p>
    <nav class="sm:ml-auto flex gap-4 sm:gap-6">
      <a class="text-xs hover:underline underline-offset-4" href="/">
        Terms of Service
      </a>
      <a class="text-xs hover:underline underline-offset-4" href="/">
        Privacy
      </a>
    </nav>
  </footer>
</div>
