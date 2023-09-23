<style global>
    @tailwind utilities;
    @tailwind components;
    @tailwind base;

    :root, html, body {
        @apply flex flex-col font-sans text-center text-[13pt] leading-7 tracking-normal text-neutral-800 bg-white w-full h-full;
    }

    * {
        @apply transition-all ease-in-out duration-300 delay-0;
    }
    
    main {
        @apply w-11/12 mx-auto py-2;
    }
</style>