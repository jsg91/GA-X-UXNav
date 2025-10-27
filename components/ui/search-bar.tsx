import React, { useState } from 'react';
import { Button, Input, XStack } from 'tamagui';

import { IconSymbol } from '@/components/ui/icon-symbol';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  width?: number | string;
}

export function SearchBar({ placeholder = "Search GA-X...", onSearch, width = 280 }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <XStack
      alignItems="center"
      backgroundColor="rgba(0, 0, 0, 0.03)"
      borderWidth="$0.5"
      borderColor="rgba(0, 0, 0, 0.1)"
      borderRadius="$4"
      paddingHorizontal="$2"
      paddingVertical="$1.5"
      width={width}
      gap="$2"
      hoverStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        borderColor: 'rgba(0, 122, 255, 0.3)',
      }}
      pressStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <IconSymbol name="magnify" size={14} color="$color" opacity={0.6} />

      <Input
        flex={1}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        backgroundColor="transparent"
        borderWidth={0}
        padding={0}
        fontSize="$3"
        color="$color"
        placeholderTextColor="$color"
        opacity={0.8}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search GA-X"
      />

      {query.length > 0 && (
        <Button
          size="$1"
          backgroundColor="transparent"
          padding="$1"
          onPress={handleClear}
          hoverStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            transform: 'scale(1.1)',
          }}
          pressStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          <IconSymbol name="close" size={12} color="$color" opacity={0.6} />
        </Button>
      )}
    </XStack>
  );
}
