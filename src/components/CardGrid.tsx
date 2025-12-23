import React from 'react';
import { Card, CardContent } from './ui/card';
import { Card as CardType } from '../hooks/useCardData';
import { DownloadButton } from './DownloadButton';

interface CardGridProps {
  cards: CardType[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onCardClick?: (card: CardType, contentType?: 'course' | 'resource') => void;
  activeTab: 'courses' | 'resources';
}

const LoadingSkeleton: React.FC = () => (
  <div className="w-full max-w-[280px] cursor-pointer group animate-pulse">
    <Card className="bg-white border border-gray-200 shadow-sm mb-3">
      <CardContent className="p-1">
        <div className="relative w-full aspect-[246/252] bg-gray-200 rounded-sm"></div>
      </CardContent>
    </Card>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

const CardItem: React.FC<{ 
  card: CardType; 
  onClick?: (card: CardType, contentType?: 'course' | 'resource') => void;
  activeTab: 'courses' | 'resources';
}> = ({ card, onClick, activeTab }) => {
  // Use consistent aspect ratio for all cards - resource dimensions (246x252px)
  const aspectRatio = 'aspect-[246/252]';
  
  const handleCardClick = async () => {
    // Handle course cards and resource cards - open modal
    if (onClick && ((activeTab === 'courses' && card.type === 'course') || (activeTab === 'resources' && card.type === 'resource'))) {
      onClick(card, activeTab === 'courses' ? 'course' : 'resource');
      return;
    }
    
    // Fallback: Handle resource cards with download URLs - auto download (for backward compatibility)
    if (activeTab === 'resources' && card.type === 'resource' && card.download_url && !onClick) {
      try {
        // Import download service dynamically to avoid circular dependencies
        const { DownloadService } = await import('../services/downloadService');
        
        // Trigger download in new tab
        const link = document.createElement('a');
        link.href = card.download_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Set download attribute to force download
        const fileName = card.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileExtension = card.download_url.split('.').pop() || 'file';
        link.download = `${fileName}.${fileExtension}`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Optional: Log download attempt if user is authenticated
        try {
          await DownloadService.requestDownload(card.id);
        } catch (error) {
          // Silent fail for logging - don't interrupt download
          console.log('Download logging failed:', error);
        }
        
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open URL in new tab
        window.open(card.download_url, '_blank', 'noopener,noreferrer');
      }
    }
  };
  return (
    <div className="w-full max-w-[560px] flex flex-col">
      <div 
        className={`group scale-200 ${
          ((activeTab === 'courses' && card.type === 'course') || 
           (activeTab === 'resources' && card.type === 'resource'))
            ? 'cursor-pointer' 
            : 'cursor-default'
        }`}
        onClick={handleCardClick}
      >
        <Card className="bg-white border border-gray-200 hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-3">
          <CardContent className="p-4">
            <div className={`relative w-full ${aspectRatio}`}>
              <img
                className="w-full h-full object-cover rounded-sm"
                alt={card.title}
                src={card.image}
                loading="lazy"
              />
            
              {/* Download indicator for downloadable resources */}
              {activeTab === 'resources' && card.type === 'resource' && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                    <svg className="w-6 h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {card.download_url ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       )}
                     </svg>
                   </div>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Fixed height title container to prevent layout shift */}
      <div>
        <p className="font-normal text-[#343434] text-sm leading-[16.8px] text-left transition-colors duration-200 line-clamp-2 overflow-hidden">
          {card.title}
        </p>
      </div>
    </div>
  );
};

export const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  loading, 
  error, 
  onRetry, 
  onCardClick,
  activeTab 
}) => {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-start">
      {loading ? (
        // Show loading skeletons
        Array(8).fill(null).map((_, index) => (
          <LoadingSkeleton key={`skeleton-${index}`} />
        ))
      ) : (
        // Show actual cards
        cards.map((card) => (
          <CardItem 
            key={card.id} 
            card={card} 
            onClick={onCardClick}
            activeTab={activeTab}
          />
        ))
      )}
    </div>
  );
};