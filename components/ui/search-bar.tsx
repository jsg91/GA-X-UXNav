import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Button, Input, XStack, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'aircraft' | 'aerodrome' | 'document' | 'event' | 'reservation' | 'person' | 'organization';
  icon: string;
  href?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  width?: number | string;
}

// Mock search function - replace with actual API call
const performSearch = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];
  
  // Mock aircraft results
  if (lowerQuery.includes('c172') || lowerQuery.includes('cessna') || lowerQuery.includes('aircraft')) {
    results.push(
      { id: 'aircraft-1', title: 'Cessna 172N', subtitle: 'Registration: ZS-ABC', type: 'aircraft', icon: 'airplane', href: '/(tabs)/fly' },
      { id: 'aircraft-2', title: 'Cessna 182', subtitle: 'Registration: ZS-XYZ', type: 'aircraft', icon: 'airplane', href: '/(tabs)/fly' },
    );
  }
  
  // Mock aerodrome results
  if (lowerQuery.includes('fala') || lowerQuery.includes('aerodrome') || lowerQuery.includes('airport')) {
    results.push(
      { id: 'aerodrome-1', title: 'FALA (Lanseria)', subtitle: 'Johannesburg, South Africa', type: 'aerodrome', icon: 'airport', href: '/(tabs)/aerodromes' },
      { id: 'aerodrome-2', title: 'FACT (Cape Town)', subtitle: 'Cape Town, South Africa', type: 'aerodrome', icon: 'airport', href: '/(tabs)/aerodromes' },
    );
  }
  
  // Mock document results
  if (lowerQuery.includes('doc') || lowerQuery.includes('manual') || lowerQuery.includes('license')) {
    results.push(
      { id: 'doc-1', title: 'PPL License', subtitle: 'License Document', type: 'document', icon: 'file-document', href: '/(tabs)/documents' },
      { id: 'doc-2', title: 'Aircraft Manual', subtitle: 'Cessna 172N Manual', type: 'document', icon: 'file-document', href: '/(tabs)/documents' },
    );
  }
  
  // Mock event results
  if (lowerQuery.includes('event') || lowerQuery.includes('meeting') || lowerQuery.includes('fly-in')) {
    results.push(
      { id: 'event-1', title: 'Monthly Fly-In', subtitle: '2024-11-15', type: 'event', icon: 'calendar', href: '/(tabs)/events' },
      { id: 'event-2', title: 'Club Meeting', subtitle: '2024-11-20', type: 'event', icon: 'calendar', href: '/(tabs)/events' },
    );
  }
  
  // Mock reservation results
  if (lowerQuery.includes('reservation') || lowerQuery.includes('booking')) {
    results.push(
      { id: 'res-1', title: 'Reservation #1234', subtitle: 'Cessna 172N - 2024-11-10', type: 'reservation', icon: 'calendar-clock', href: '/(tabs)/reservations' },
    );
  }
  
  // Generic results based on query
  if (results.length === 0) {
    results.push(
      { id: 'generic-1', title: `Search for "${query}"`, subtitle: 'No specific results found', type: 'document', icon: 'magnify', href: undefined },
    );
  }
  
  return results.slice(0, 8); // Limit to 8 results
};

export function SearchBar({ placeholder = "Search GA-X...", onSearch, onResultSelect, width = 280 }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const scrollContainerRef = useRef<any>(null);

  // Inject custom scrollbar styles for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const styleId = 'search-results-scrollbar-style';
      
      // Inject global styles once
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          [data-search-scroll]::-webkit-scrollbar {
            width: 8px;
          }
          [data-search-scroll]::-webkit-scrollbar-track {
            background: transparent;
          }
          [data-search-scroll]::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }
          [data-search-scroll]::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.3);
          }
          [data-search-scroll] {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Apply scrollbar styling when dropdown is shown
  useEffect(() => {
    if (Platform.OS === 'web' && scrollContainerRef.current && isFocused && query.trim().length > 0) {
      const element = scrollContainerRef.current as HTMLElement;
      if (element) {
        element.setAttribute('data-search-scroll', 'true');
      }
    }
  }, [isFocused, query]);

  const handleResultSelect = useCallback((result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setQuery('');
    setSearchResults([]);
    setIsFocused(false);
    setSelectedIndex(-1);
  }, [onResultSelect]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        const results = performSearch(query);
        setSearchResults(results);
        setSelectedIndex(-1);
      }, 300);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Close dropdown when clicking outside and handle keyboard navigation
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused || searchResults.length === 0) return;
      
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (event.key === 'Escape') {
        setIsFocused(false);
        setSearchResults([]);
      } else if (event.key === 'Enter' && selectedIndex >= 0 && searchResults[selectedIndex]) {
        event.preventDefault();
        handleResultSelect(searchResults[selectedIndex]);
      }
    };

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused, searchResults, selectedIndex, handleResultSelect]);

  const handleSubmit = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
      setIsFocused(false);
    } else if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      handleResultSelect(searchResults[selectedIndex]);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  const showDropdown = isFocused && query.trim().length > 0;

  const typeLabels: Record<SearchResult['type'], string> = {
    aircraft: 'Aircraft',
    aerodrome: 'Aerodrome',
    document: 'Document',
    event: 'Event',
    reservation: 'Reservation',
    person: 'Person',
    organization: 'Organization',
  };

  return (
    <YStack position="relative" ref={containerRef} width={width} zIndex={1000}>
      <XStack
        alignItems="center"
        backgroundColor="rgba(0, 0, 0, 0.03)"
        borderColor={isFocused ? "rgba(0, 122, 255, 0.5)" : "rgba(0, 0, 0, 0.1)"}
        borderRadius="$4"
        borderWidth="$0.5"
        gap="$2"
        height="100%"
        hoverStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
          borderColor: 'rgba(0, 122, 255, 0.3)',
        }}
        paddingHorizontal="$2"
        paddingVertical="$1"
        pressStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <IconSymbol style={{ opacity: 0.6 }} name="magnify" color="$color" size={14} />

        <Input
          ref={inputRef}
          onBlur={() => {
            // Delay blur to allow click on results
            setTimeout(() => setIsFocused(false), 200);
          }}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onSubmitEditing={handleSubmit}
          value={query}
          placeholder={placeholder}
          accessibilityLabel="Search GA-X"
          autoCapitalize="none"
          autoCorrect={false}
          backgroundColor="transparent"
          borderWidth={0}
          color="$color"
          flex={1}
          fontSize="$4"
          lineHeight="$4"
          minHeight={32}
          opacity={0.8}
          paddingHorizontal={0}
          paddingVertical="$2"
          placeholderTextColor="$color"
          returnKeyType="search"
        />

        {query.length > 0 && (
          <Button
            onPress={handleClear}
            backgroundColor="transparent"
            hoverStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.1)',
            }}
            padding="$1"
            pressStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
            }}
            size="$1"
          >
            <IconSymbol style={{ opacity: 0.6 }} name="close" color="$color" size={12} />
          </Button>
        )}
      </XStack>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <YStack
          backgroundColor="$background"
          borderColor="rgba(0, 0, 0, 0.1)"
          borderRadius="$3"
          borderWidth={1}
          left={0}
          marginTop="$1"
          maxHeight={320}
          overflow="hidden"
          position="absolute"
          right={0}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          top="100%"
          zIndex={1001}
        >
          {searchResults.length > 0 ? (
            <YStack 
              ref={scrollContainerRef}
              maxHeight={320} 
              overflow="scroll"
              {...(Platform.OS === 'web' && {
                // @ts-ignore - web-specific attribute
                'data-search-scroll': 'true',
              })}
            >
              {searchResults.map((result, index) => {
                const isSelected = selectedIndex === index;
                
                return (
                  <Button
                    key={result.id}
                    onPress={() => handleResultSelect(result)}
                    backgroundColor={isSelected ? 'rgba(0, 122, 255, 0.1)' : 'transparent'}
                    borderBottomColor="rgba(0, 0, 0, 0.05)"
                    borderBottomWidth={index < searchResults.length - 1 ? 1 : 0}
                    borderRadius={0}
                    hoverStyle={{
                      backgroundColor: 'rgba(0, 122, 255, 0.08)',
                    }}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    pressStyle={{
                      backgroundColor: 'rgba(0, 122, 255, 0.12)',
                    }}
                  >
                    <XStack alignItems="center" flex={1} gap="$2.5">
                      <IconSymbol
                        style={{ opacity: isSelected ? 1 : 0.6 }}
                        name={result.icon as any}
                        color={isSelected ? "$tint" : "$color"}
                        size={18}
                      />
                      
                      <YStack flex={1} gap="$0.5" minWidth={0}>
                        <ThemedText
                          color={isSelected ? "$tint" : "$color"}
                          fontSize="$4"
                          fontWeight={isSelected ? "$6" : "$4"}
                        >
                          {result.title}
                        </ThemedText>
                        {result.subtitle && (
                          <ThemedText
                            style={{ opacity: 0.65 }}
                            color="$color"
                            fontSize="$3"
                          >
                            {result.subtitle}
                          </ThemedText>
                        )}
                      </YStack>
                      
                      <ThemedText
                        style={{ opacity: 0.5 }}
                        color="$color"
                        fontSize="$2"
                        fontWeight="$4"
                      >
                        {typeLabels[result.type]}
                      </ThemedText>
                    </XStack>
                  </Button>
                );
              })}
            </YStack>
          ) : (
            <YStack alignItems="center" justifyContent="center" minHeight={100} padding="$4">
              <IconSymbol style={{ opacity: 0.3, marginBottom: 8 }} name="magnify" color="$color" size={24} />
              <ThemedText style={{ opacity: 0.5 }} color="$color" fontSize="$3">
                No results found
              </ThemedText>
              <ThemedText style={{ opacity: 0.4, marginTop: 4 }} color="$color" fontSize="$2">
                Try a different search term
              </ThemedText>
            </YStack>
          )}
        </YStack>
      )}
    </YStack>
  );
}
