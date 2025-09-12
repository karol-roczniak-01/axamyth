export const components = {
  h1: (props: any) => <h1 className="text-3xl text-center font-serif font-bold mb-8" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-serif font-semibold mb-6" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-serif font-medium mb-4" {...props} />,
  h4: (props: any) => <h3 className="text-lg font-serif font-medium mb-2" {...props} />,

  p: (props: any) => <p className="indent-8 text-justify font-serif-secondary text-foreground/70 leading-relaxed md:text-lg text-base" {...props} />,
  
  ul: (props: any) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
};