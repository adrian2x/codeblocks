from algoliasearch.search_client import SearchClient

# Connect and authenticate with your Algolia app
client = SearchClient.create("GP9KRDHAVO", "f5ff0b69aefc44433374f2b81b5de7df")

# Create a new index and add a record


def search_posts(query, search_dict=None):
    "Searches for posts in algolia"
    index = client.init_index("posts")
    results = index.search(query, search_dict)
    print(results["hits"][0])


# {"attributesToRetrieve": ["language"], "hitsPerPage": 50}
search_posts(
    "python",
)
