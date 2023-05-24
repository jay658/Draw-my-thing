import { lazy } from 'react'

export function lazyLoad(path:string, namedExport?:string) {
  return lazy(async () => {
    const promise = import(/* @vite-ignore */path);
    if (namedExport === undefined) {
      return promise;
    } else {
      const module = await promise;
      return { default: module[namedExport] };
    }
  });
}

/*
Usage: 
lazyLoad('./components/About', 'About')

This needs to be wrapped in a <Suspense fallback={<OtherComponent/>}></Suspense>
Suspense is imported from React

**NOTE** The path should be relative to where this function is located, NOT to the file this function is being used in

Can also use useTransition. This will make the page keep the old data until the new data is loaded.
const [isPending, startTransition] = useTransition()

Use example below. The page will display the previous counter value until it loads the next value.
<button
  onClick={() => {
    startTransition(() => {
      setCounter(counter => counter + 1)
    })
  }}
>
  My Button
</button>
*/