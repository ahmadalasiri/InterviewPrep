# Caching - Learning Resources

A curated list of high-quality resources for learning caching strategies, implementations, and best practices.

## 📖 Official Documentation

### Redis
- [Redis Official Documentation](https://redis.io/documentation) - Comprehensive Redis docs
- [Redis Commands Reference](https://redis.io/commands) - Complete command list
- [Redis Best Practices](https://redis.io/topics/best-practices) - Production guidelines
- [Redis Persistence](https://redis.io/topics/persistence) - RDB and AOF explained
- [Redis Clustering](https://redis.io/topics/cluster-tutorial) - Distributed Redis

### Memcached
- [Memcached Official Documentation](https://memcached.org/) - Getting started guide
- [Memcached Wiki](https://github.com/memcached/memcached/wiki) - Community documentation

### CDN Documentation
- [Cloudflare Caching](https://developers.cloudflare.com/cache/) - CDN caching guide
- [AWS CloudFront](https://docs.aws.amazon.com/cloudfront/) - AWS CDN documentation
- [Fastly Documentation](https://docs.fastly.com/) - Edge computing and caching

## 🎓 Interactive Tutorials

### Redis
- [Try Redis](https://try.redis.io/) - Interactive Redis tutorial in browser
- [Redis University](https://university.redis.com/) - Free Redis courses
- [Redis Labs Tutorials](https://redis.com/try-free/) - Hands-on exercises

### General Caching
- [Caching Strategies Tutorial](https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one/) - Detailed guide
- [System Design - Caching](https://www.enjoyalgorithms.com/blog/caching-system-design-concept) - System design perspective

## 📚 Books

### Caching & Performance
- **"Database Internals" by Alex Petrov** - Deep dive into storage and caching
- **"Designing Data-Intensive Applications" by Martin Kleppmann** - Chapter on caching
- **"High Performance Browser Networking" by Ilya Grigorik** - Web caching strategies
- **"The Art of Scalability" by Martin L. Abbott** - Caching in distributed systems
- **"Site Reliability Engineering" by Google** - Production caching strategies

### Redis-Specific
- **"Redis in Action" by Josiah L. Carlson** - Practical Redis patterns
- **"Redis Essentials" by Maxwell Dayvson Da Silva** - Redis fundamentals
- **"Mastering Redis" by Jeremy Nelson** - Advanced Redis techniques

### System Design
- **"System Design Interview" by Alex Xu** - Caching in interviews
- **"Designing Distributed Systems" by Brendan Burns** - Distributed caching patterns

## 🎥 Video Courses

### YouTube Playlists
- [Redis Crash Course](https://www.youtube.com/watch?v=jgpVdJB2sKQ) - Traversy Media
- [Caching Strategies](https://www.youtube.com/watch?v=U3RkDLtS7uY) - Hussein Nasser
- [System Design Caching](https://www.youtube.com/watch?v=iuqZvajTOyA) - Gaurav Sen
- [Redis Tutorial](https://www.youtube.com/watch?v=Hbt56gFj998) - freeCodeCamp

### Paid Courses
- **Udemy**: "Redis: The Complete Developer's Guide" by Stephen Grider
- **Pluralsight**: "Redis Fundamentals" by Mark Seemann
- **LinkedIn Learning**: "Learning Redis" by Michael Levan
- **Educative.io**: "Caching Best Practices" - Interactive course

## 📝 Articles & Blogs

### Caching Strategies
- [Caching Best Practices](https://aws.amazon.com/caching/best-practices/) - AWS Guide
- [Cache Aside Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside) - Microsoft Azure
- [Caching Strategies and Patterns](https://medium.com/@mmoshikoo/cache-strategies-996e91c80303) - Medium
- [The Architecture of Open Source Applications: Redis](http://aosabook.org/en/redis.html) - Deep dive

### Redis Deep Dives
- [Redis Under The Hood](https://pauladamsmith.com/articles/redis-under-the-hood.html) - Internals explained
- [Redis Memory Optimization](https://redis.io/topics/memory-optimization) - Reducing memory usage
- [Redis Pub/Sub](https://redis.io/topics/pubsub) - Messaging patterns
- [Redis Pipelining](https://redis.io/topics/pipelining) - Performance optimization

### System Design
- [Designing a URL Shortener](https://www.educative.io/courses/grokking-the-system-design-interview/m2ygV4E81AR) - With caching
- [Facebook's Memcached Architecture](https://engineering.fb.com/2008/12/15/core-data/scaling-memcache-at-facebook/) - At scale
- [Twitter's Cache Architecture](https://blog.twitter.com/engineering/en_us/a/2012/storing-hundreds-of-millions-of-simple-key-value-pairs-in-redis) - Production case study
- [Instagram's Redis Usage](https://instagram-engineering.com/storing-hundreds-of-millions-of-simple-key-value-pairs-in-redis-1091ae80f74c) - Real world

### Performance
- [Cache Performance Metrics](https://www.datadoghq.com/knowledge-center/redis-monitoring/) - What to monitor
- [Redis Benchmarking](https://redis.io/topics/benchmarks) - Performance testing
- [Cache Stampede Solutions](https://engineering.fb.com/2015/12/03/ios/under-the-hood-broadcasting-live-video-to-millions/) - Facebook's approach

## 🛠️ Tools & Libraries

### Node.js
```bash
# In-memory caching
npm install node-cache          # Simple in-memory cache
npm install lru-cache           # LRU cache implementation
npm install memory-cache        # Simple memory cache
npm install cache-manager       # Flexible caching framework

# Redis clients
npm install redis               # Official Redis client
npm install ioredis             # Advanced Redis client
npm install redis-om            # Redis object mapper

# Distributed caching
npm install node-cache-manager-redis-store
npm install keyv                # Simple key-value storage
```

### Go
```bash
# In-memory caching
go get github.com/patrickmn/go-cache        # Popular Go cache
go get github.com/dgraph-io/ristretto       # High-performance cache
go get github.com/allegro/bigcache          # Fast cache library
go get github.com/golang/groupcache         # Google's groupcache

# Redis clients
go get github.com/go-redis/redis/v9         # Go Redis client
go get github.com/gomodule/redigo           # Redis client library
```

### Python
```bash
# In-memory caching
pip install cachetools          # Extensible caching library
pip install functools           # Built-in lru_cache

# Redis clients
pip install redis               # Redis Python client
pip install redis-py-cluster    # Redis cluster client
pip install django-redis        # Django Redis integration
```

### Java
```xml
<!-- Caffeine Cache -->
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
    <version>3.1.8</version>
</dependency>

<!-- Guava Cache -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.1.3-jre</version>
</dependency>

<!-- Ehcache -->
<dependency>
    <groupId>org.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>3.10.8</version>
</dependency>

<!-- Redis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>5.0.2</version>
</dependency>
```

## 🧪 Practice Platforms

### Coding Challenges
- **LeetCode**: LRU Cache (146), LFU Cache (460)
- **HackerRank**: [Caching Problems](https://www.hackerrank.com/domains/databases)
- **Codewars**: Caching kata challenges
- **Exercism**: Redis exercises

### System Design
- **Pramp**: Mock interviews with caching scenarios
- **interviewing.io**: Practice system design questions
- **Exponent**: System design courses with caching

### Hands-on Labs
- **Redis Labs**: [Free Redis Cloud](https://redis.com/try-free/)
- **AWS Free Tier**: ElastiCache Redis
- **Google Cloud**: Memorystore for Redis
- **Azure**: Azure Cache for Redis

## 📊 Benchmarking Tools

### Redis
```bash
# Redis benchmark tool
redis-benchmark -h localhost -p 6379 -n 100000 -c 50

# memtier benchmark
memtier_benchmark -s localhost -p 6379 -n 100000 --ratio=1:1
```

### General
- **Apache Bench (ab)**: HTTP caching benchmarks
- **wrk**: Modern HTTP benchmarking tool
- **Artillery**: Load testing with caching scenarios
- **k6**: Performance testing tool

## 🎯 Interview Preparation

### Question Banks
- [InterviewBit - Caching Questions](https://www.interviewbit.com/courses/system-design/)
- [Grokking the System Design Interview](https://www.educative.io/courses/grokking-the-system-design-interview)
- [System Design Primer - Caching](https://github.com/donnemartin/system-design-primer#cache)
- [LeetCode Discuss - Caching Patterns](https://leetcode.com/discuss/interview-question/system-design/)

### Mock Interviews
- **Pramp**: Free peer-to-peer mock interviews
- **interviewing.io**: Anonymous technical interviews
- **Exponent**: System design mock interviews
- **Gainlo**: Mock interviews with ex-Google engineers

## 🌐 Communities

### Reddit
- [r/redis](https://www.reddit.com/r/redis/) - Redis community
- [r/programming](https://www.reddit.com/r/programming/) - General programming
- [r/cscareerquestions](https://www.reddit.com/r/cscareerquestions/) - Interview prep

### Stack Overflow
- [Redis tag](https://stackoverflow.com/questions/tagged/redis)
- [Caching tag](https://stackoverflow.com/questions/tagged/caching)
- [Memcached tag](https://stackoverflow.com/questions/tagged/memcached)

### Discord/Slack
- [Redis Discord](https://discord.gg/redis) - Official Redis community
- [DevOps Chat](https://devopschat.co/) - Infrastructure discussions
- [Hashnode](https://hashnode.com/) - Developer community

### Conferences
- **RedisConf**: Annual Redis conference
- **StrangeLoop**: Systems programming conference
- **QCon**: Software development conference
- **GOTO**: Developer conferences

## 📈 Real-World Case Studies

### Tech Company Engineering Blogs
- [Netflix Tech Blog](https://netflixtechblog.com/) - EVCache (Memcached)
- [Uber Engineering](https://eng.uber.com/) - Distributed caching
- [Airbnb Engineering](https://medium.com/airbnb-engineering) - Caching strategies
- [Pinterest Engineering](https://medium.com/pinterest-engineering) - Redis at scale
- [Dropbox Tech Blog](https://dropbox.tech/) - Caching architecture
- [LinkedIn Engineering](https://engineering.linkedin.com/) - Caching patterns

### Specific Articles
- [Scaling Memcache at Facebook](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf) - Research paper
- [How Discord Stores Billions of Messages](https://discord.com/blog/how-discord-stores-billions-of-messages) - Cassandra + cache
- [Slack's Redis Usage](https://slack.engineering/scaling-slacks-job-queue/) - Job queue caching
- [GitHub's MySQL to Redis Migration](https://github.blog/2021-10-06-improving-git-protocol-security-github/) - Production migration

## 🔧 Development Tools

### Redis GUI Clients
- **RedisInsight**: Official Redis GUI
- **Medis**: Elegant Redis GUI for macOS
- **Redis Desktop Manager**: Cross-platform Redis GUI
- **TablePlus**: Multi-database GUI with Redis support

### Monitoring
- **Redis Monitor**: Built-in monitoring command
- **RedisInsight**: Real-time monitoring
- **Prometheus + Grafana**: Metrics and dashboards
- **Datadog**: Redis monitoring integration
- **New Relic**: APM with Redis support

### CLI Tools
```bash
# Redis CLI
redis-cli                    # Interactive shell
redis-cli --stat             # Live stats
redis-cli --bigkeys          # Find big keys
redis-cli --memkeys          # Memory usage by key

# Monitoring
redis-cli MONITOR            # Watch commands in real-time
redis-cli INFO               # Server information
redis-cli SLOWLOG GET 10     # Slow query log
```

## 📱 Cheat Sheets

- [Redis Command Cheat Sheet](https://redis.io/commands) - Official
- [Redis Quick Reference](https://lzone.de/cheat-sheet/Redis) - Community
- [Caching Strategies Cheat Sheet](https://www.linkedin.com/pulse/caching-strategies-cheat-sheet-mohammad-ali-shahvand/) - Visual guide
- [System Design Caching Patterns](https://github.com/donnemartin/system-design-primer#cache) - GitHub primer

## 🎓 Online Courses (Free)

### University Courses
- [MIT 6.824: Distributed Systems](https://pdos.csail.mit.edu/6.824/) - Caching in distributed systems
- [Stanford CS 144: Computer Networking](https://cs144.github.io/) - Network caching
- [UC Berkeley CS 162: Operating Systems](https://cs162.org/) - Memory caching

### MOOCs
- [Coursera: Cloud Computing Concepts](https://www.coursera.org/learn/cloud-computing) - Distributed caching
- [edX: Data Structures](https://www.edx.org/learn/data-structures) - Cache data structures
- [Khan Academy: Algorithms](https://www.khanacademy.org/computing/computer-science/algorithms) - Cache algorithms

## 🧠 Advanced Topics

### Research Papers
- [Memcached at Facebook](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf) - Scaling memcached
- [Redis: The Write Behind Caching Strategy](https://redis.io/docs/manual/patterns/write-behind/) - Pattern explanation
- [Consistent Hashing and Random Trees](https://www.akamai.com/us/en/multimedia/documents/technical-publication/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf) - Original paper
- [The Tail at Scale](https://research.google/pubs/pub40801/) - Google's approach

### Academic Resources
- [ACM Digital Library](https://dl.acm.org/) - Search "caching strategies"
- [IEEE Xplore](https://ieeexplore.ieee.org/) - Caching research
- [arXiv.org](https://arxiv.org/) - Computer Science papers
- [Google Scholar](https://scholar.google.com/) - Academic search

## 🔍 Additional Learning Paths

### Web Performance
- [Web.dev Caching](https://web.dev/http-cache/) - Browser caching
- [MDN: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) - HTTP headers
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging cache

### Database Caching
- [PostgreSQL Query Plan Cache](https://www.postgresql.org/docs/current/sql-prepare.html)
- [MySQL Query Cache](https://dev.mysql.com/doc/refman/8.0/en/query-cache.html)
- [MongoDB WiredTiger Cache](https://www.mongodb.com/docs/manual/core/wiredtiger/)

### Microservices
- [Martin Fowler: Cache](https://martinfowler.com/bliki/TwoHardThings.html) - Caching philosophy
- [Microservices Patterns: Cache-Aside](https://microservices.io/patterns/data/cache-aside.html)
- [API Gateway Caching](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html)

## 📬 Newsletters

- [Redis Weekly](https://redisweekly.com/) - Weekly Redis news
- [System Design Newsletter](https://blog.algomaster.io/) - Includes caching topics
- [High Scalability](http://highscalability.com/) - Scaling strategies
- [Backend Weekly](https://backend-weekly.com/) - Backend engineering

## 🎖️ Certifications

### Redis
- [Redis Certified Developer](https://university.redis.com/certification) - Official Redis cert

### Cloud Providers
- **AWS**: Solutions Architect (ElastiCache coverage)
- **Google Cloud**: Professional Cloud Architect (Memorystore)
- **Azure**: Azure Administrator (Azure Cache for Redis)

## 💻 Open Source Projects to Study

### Caching Libraries
- [groupcache](https://github.com/golang/groupcache) - Google's distributed cache
- [Caffeine](https://github.com/ben-manes/caffeine) - High-performance Java cache
- [node-cache](https://github.com/node-cache/node-cache) - Node.js cache

### Production Systems
- [Varnish Cache](https://github.com/varnishcache/varnish-cache) - HTTP accelerator
- [Nginx](https://github.com/nginx/nginx) - Web server with caching
- [Cloudflare Workers](https://github.com/cloudflare/workers-sdk) - Edge caching

---

## 🎯 Recommended Learning Order

### Month 1: Foundations
1. Read "Caching Best Practices" articles
2. Complete Redis interactive tutorial
3. Implement LRU cache from scratch
4. Study cache-aside pattern
5. Watch Hussein Nasser's caching videos

### Month 2: Redis Deep Dive
1. Complete Redis University courses
2. Read "Redis in Action" book
3. Build project with Redis caching
4. Practice Redis data structures
5. Study pub/sub and transactions

### Month 3: Advanced Patterns
1. Study distributed caching
2. Implement consistent hashing
3. Read Facebook/Netflix case studies
4. Practice system design problems
5. Build multi-level cache system

### Month 4: Interview Prep
1. Review all interview questions
2. Practice LeetCode cache problems
3. Do mock system design interviews
4. Read production case studies
5. Build portfolio projects with caching

---

**Stay Updated!** 

Follow Redis Labs, Netflix Tech Blog, and High Scalability blog for the latest caching strategies and best practices.

**Remember**: The best way to learn caching is to implement it! Build projects, measure performance, and iterate.

Happy Learning! 🚀

