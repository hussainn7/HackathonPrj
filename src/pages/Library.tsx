import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingScrolls from '@/components/FloatingScrolls';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Upload, Download, Eye, Star, Clock, Globe, BookOpen, Archive, Trash2 } from 'lucide-react';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for scrolls
  const scrolls = [
    {
      id: 1,
      title: "The Art of War",
      author: "Sun Tzu",
      category: "philosophy",
      language: "Ancient Chinese",
      dateAdded: "2024-01-15",
      replicas: 3,
      status: "preserved",
      description: "Ancient Chinese military treatise on strategy and warfare",
      tags: ["strategy", "warfare", "philosophy", "ancient"]
    },
    {
      id: 2,
      title: "Elements of Geometry",
      author: "Euclid",
      category: "mathematics",
      language: "Ancient Greek",
      dateAdded: "2024-01-10",
      replicas: 5,
      status: "preserved",
      description: "Foundational work on geometry and mathematical principles",
      tags: ["mathematics", "geometry", "ancient", "science"]
    },
    {
      id: 3,
      title: "The Republic",
      author: "Plato",
      category: "philosophy",
      language: "Ancient Greek",
      dateAdded: "2024-01-08",
      replicas: 4,
      status: "preserved",
      description: "Philosophical dialogue on justice and the ideal state",
      tags: ["philosophy", "politics", "ancient", "ethics"]
    },
    {
      id: 4,
      title: "Almagest",
      author: "Ptolemy",
      category: "astronomy",
      language: "Ancient Greek",
      dateAdded: "2024-01-05",
      replicas: 2,
      status: "preserved",
      description: "Comprehensive treatise on astronomy and celestial mechanics",
      tags: ["astronomy", "science", "ancient", "mathematics"]
    },
    {
      id: 5,
      title: "Natural History",
      author: "Pliny the Elder",
      category: "science",
      language: "Latin",
      dateAdded: "2024-01-03",
      replicas: 3,
      status: "preserved",
      description: "Encyclopedia of natural knowledge and scientific observations",
      tags: ["science", "nature", "ancient", "encyclopedia"]
    },
    {
      id: 6,
      title: "The Iliad",
      author: "Homer",
      category: "literature",
      language: "Ancient Greek",
      dateAdded: "2024-01-01",
      replicas: 6,
      status: "preserved",
      description: "Epic poem recounting the Trojan War",
      tags: ["literature", "poetry", "ancient", "epic"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Scrolls', count: scrolls.length },
    { id: 'philosophy', name: 'Philosophy', count: scrolls.filter(s => s.category === 'philosophy').length },
    { id: 'mathematics', name: 'Mathematics', count: scrolls.filter(s => s.category === 'mathematics').length },
    { id: 'astronomy', name: 'Astronomy', count: scrolls.filter(s => s.category === 'astronomy').length },
    { id: 'science', name: 'Science', count: scrolls.filter(s => s.category === 'science').length },
    { id: 'literature', name: 'Literature', count: scrolls.filter(s => s.category === 'literature').length }
  ];

  const filteredScrolls = scrolls.filter(scroll => {
    const matchesSearch = scroll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scroll.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scroll.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || scroll.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preserved': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'replicating': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'at-risk': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'philosophy': return '🧠';
      case 'mathematics': return '📐';
      case 'astronomy': return '🌟';
      case 'science': return '🔬';
      case 'literature': return '📚';
      default: return '📜';
    }
  };

  return (
    <div className="min-h-screen bg-background papyrus-texture">
      <Navbar />
      <FloatingScrolls />
      
      <main className="relative pt-20">
        {/* Header Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground font-cinzel mb-6">
                CodeExplore Library
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Browse and manage the vast collection of knowledge preserved across the ancient library network. 
                Each scroll represents wisdom that has survived the ages.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="glass-card border-amber-500/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{scrolls.length}</div>
                  <div className="text-sm text-muted-foreground">Total Scrolls</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-green-500/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {scrolls.reduce((sum, scroll) => sum + scroll.replicas, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Replicas</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-blue-500/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {scrolls.filter(s => s.status === 'preserved').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Preserved</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {new Set(scrolls.map(s => s.language)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search scrolls by title, author, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>
              <Button className="glass-button">
                <Upload className="mr-2 h-4 w-4" />
                Upload Scroll
              </Button>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
              <TabsList className="glass-card grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <span>{getCategoryIcon(category.id)}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                    <Badge variant="secondary" className="ml-1">{category.count}</Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Scrolls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScrolls.map((scroll) => (
                <Card key={scroll.id} className="glass-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(scroll.category)}</span>
                        <div>
                          <CardTitle className="text-lg font-cinzel">{scroll.title}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            by {scroll.author}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(scroll.status)}>
                        {scroll.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {scroll.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {scroll.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {scroll.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{scroll.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {scroll.language}
                        </div>
                        <div className="flex items-center gap-1">
                          <Archive className="h-3 w-3" />
                          {scroll.replicas} replicas
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(scroll.dateAdded).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 glass-button">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="glass-button">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="glass-button">
                        <Star className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredScrolls.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No scrolls found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Library;
