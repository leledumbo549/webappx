import Footer from '../components/Footer'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'

function About() {
  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      <Container className="w-full max-w-3xl">
        <SectionTitle>About Us</SectionTitle>
        <p className="mb-4 text-gray-700">
          Welcome to our web application! We are passionate developers dedicated
          to building modern, user-friendly, and efficient web experiences. Our
          mission is to empower users with intuitive interfaces and robust
          features.
        </p>
        <h3 className="text-xl font-semibold mb-2">Our Story</h3>
        <p className="mb-4 text-gray-700">
          Founded in 2025, our team started as a small group of friends who
          loved coding and solving real-world problems. Over time, we have grown
          into a collaborative community, always striving to learn and innovate.
        </p>
        <h3 className="text-xl font-semibold mb-2">What We Do</h3>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>
            Develop high-quality web applications using the latest technologies
          </li>
          <li>Share knowledge and resources with the developer community</li>
          <li>Continuously improve our products based on user feedback</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
        <p className="text-gray-700">
          Have questions or suggestions? Reach out to us at{' '}
          <a href="mailto:info@example.com" className="text-blue-600 underline">
            info@example.com
          </a>
          .
        </p>
        <Footer />
      </Container>
    </div>
  )
}

export default About
