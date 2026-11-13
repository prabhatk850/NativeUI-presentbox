import React, { useRef } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Video, { ViewType, type ReactVideoSource, type VideoRef } from 'react-native-video';
import { breakpoints, fonts, gradients, layout } from '../../../theme';

// Metro resolves an asset import to a number, Vite (web) to a URL string.
type Source = number | string;

// Full-screen looping background video with a headline on top.
function VideoComponent({ source, text }: { source: Source; text: string }) {
  const { width, height } = useWindowDimensions();
  const narrow = width < breakpoints.sm;
  const player = useRef<VideoRef>(null);

  return (
    <View style={[styles.background, { height }]}>
      <Video
        ref={player}
        source={{ uri: source } as unknown as ReactVideoSource /* uri may be a Metro asset id, supported at runtime */}
        style={[StyleSheet.absoluteFill, styles.video]}
        resizeMode="cover"
        repeat
        // safety net for Android players that stop on the last frame despite `repeat`
        onEnd={() => {
          player.current?.seek(0);
          player.current?.resume();
        }}
        paused={false}
        // Android: TextureView composes with overlays (menu, sheets) instead of punching a black hole,
        // and a transparent shutter avoids a black flash while the loop restarts
        viewType={ViewType.TEXTURE}
        shutterColor="transparent"
        muted
        playInBackground={false}
        disableFocus
        controls={false}
      />
      {/* soft top/bottom scrim keeps the bar and headline legible on any frame */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.scrim]} />
      <View style={[styles.overlay, narrow ? styles.overlayNarrow : styles.overlayWide]}>
        <Text style={[styles.text, narrow && styles.textNarrow]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { width: '100%', overflow: 'hidden', backgroundColor: '#000' },
  // react-native-video's web player ignores resizeMode and always letterboxes (objectFit: contain);
  // on a tall phone screen that leaves black bands above and below the clip (objectFit is web-only CSS, not in RN's types)
  video: Platform.OS === 'web' ? ({ objectFit: 'cover' } as object) : {},
  scrim: { backgroundImage: gradients.heroScrim },
  overlay: { flex: 1 },
  // phones: headline sits low, left-aligned, like a native app hero; desktop: centred
  overlayNarrow: { justifyContent: 'flex-end', paddingHorizontal: layout.mobileGutter + 8, paddingBottom: 72 },
  overlayWide: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: layout.pageGutter },
  text: {
    fontFamily: fonts.bold,
    fontSize: 64,
    lineHeight: 70,
    letterSpacing: -1.5,
    maxWidth: 900,
    textAlign: 'center',
    color: '#fff',
  },
  textNarrow: { fontSize: 34, lineHeight: 40, letterSpacing: -0.8, textAlign: 'left' },
});

export default VideoComponent;
