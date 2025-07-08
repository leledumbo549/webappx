import Footer from '../components/Footer'

function Blogs() {
  const blogs = [
    {
      title: 'The Day I Climbed Mount Fuji',
      content: `In the summer of 2019, I set out to climb Mount Fuji. The journey began at midnight, hiking under a sky full of stars. As dawn approached, the horizon turned orange and pink, and I reached the summit just in time to watch the sunrise above the clouds. It was a moment of pure awe and accomplishment.`,
      created: '2019-08-10 05:30',
    },
    {
      title: 'How I Learned to Code',
      content: `My coding journey started in high school with a simple HTML page. I spent countless nights debugging JavaScript and building small projects. Over the years, I joined hackathons, contributed to open source, and eventually landed my first developer job. The learning never stops, but that's what makes it exciting!`,
      created: '2015-04-22 21:00',
    },
    {
      title: 'A Rainy Day in Kyoto',
      content: `Wandering through Kyoto's ancient streets in the rain, I stumbled upon a tiny teahouse. The owner welcomed me with a warm cup of matcha and stories of the city's history. The gentle sound of rain on the roof and the peaceful atmosphere made it a day to remember.`,
      created: '2018-11-03 14:15',
    },
    {
      title: 'The Unexpected Marathon',
      content: `I signed up for a local 5K but ended up running a full marathon after a friend convinced me at the starting line. The last few miles were tough, but the crowd's cheers and the sense of achievement at the finish line made it all worthwhile.`,
      created: '2021-06-12 12:00',
    },
    {
      title: 'Lost in Venice',
      content: `During a solo trip to Italy, I got lost in the winding alleys of Venice. Instead of panicking, I embraced the adventure, discovering hidden cafes and beautiful canals that weren’t on any map.`,
      created: '2017-09-18 17:45',
    },
    {
      title: 'My First Hackathon',
      content: `Nervous but excited, I joined my first hackathon in college. My team built a weather app overnight, fueled by pizza and coffee. We didn’t win, but the experience sparked my passion for tech collaboration.`,
      created: '2016-02-27 08:00',
    },
    {
      title: 'A Night Under the Northern Lights',
      content: `Camping in Norway, I witnessed the aurora borealis for the first time. The sky danced with green and purple lights, leaving me speechless and grateful for nature’s wonders.`,
      created: '2020-01-19 23:10',
    },
    {
      title: 'The Book That Changed Me',
      content: `Reading "Man’s Search for Meaning" by Viktor Frankl during a difficult time gave me a new perspective on resilience and purpose. It’s a book I recommend to everyone.`,
      created: '2014-05-05 19:30',
    },
    {
      title: 'Learning to Cook Thai Food',
      content: `After a cooking class in Bangkok, I fell in love with Thai cuisine. Now, I make pad thai and green curry for friends and family, always remembering the flavors and laughter from that day.`,
      created: '2019-12-14 16:00',
    },
    {
      title: 'The Power of Saying Yes',
      content: `One year, I challenged myself to say "yes" to new opportunities. From joining a public speaking club to traveling solo, each "yes" led to growth, new friends, and unforgettable memories.`,
      created: '2022-03-08 10:20',
    },
  ]
  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Blogs</h2>
        {blogs.map((blog, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4 border">
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <div className="text-xs text-gray-400 mb-2">
              Created: {blog.created}
            </div>
            <p className="text-gray-700 whitespace-pre-line">{blog.content}</p>
          </div>
        ))}
        <Footer />
      </div>
    </div>
  )
}

export default Blogs
