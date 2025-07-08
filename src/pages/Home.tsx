import { Button } from '../components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert'
import Footer from '../components/Footer'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion'

function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">shadcn/ui Components Showcase</h1>

      {/* Button Showcase */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Button</h2>
        <Button>Default Button</Button>
      </section>

      {/* Alert Showcase */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Alert</h2>
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This is a shadcn/ui alert component. You can use it to display
            important messages to your users.
          </AlertDescription>
        </Alert>
      </section>

      {/* Accordion Showcase */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Accordion</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is shadcn/ui?</AccordionTrigger>
            <AccordionContent>
              shadcn/ui is a collection of beautifully designed components built
              with Radix UI and Tailwind CSS, designed for React projects.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I use these components?</AccordionTrigger>
            <AccordionContent>
              Install the component you need, import it, and use it in your
              React code. Each component is customizable with Tailwind classes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I customize the styles?</AccordionTrigger>
            <AccordionContent>
              Yes! All components are styled with Tailwind CSS, so you can
              easily adjust the look and feel to match your project.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <Footer />
    </div>
  )
}

export default Home
