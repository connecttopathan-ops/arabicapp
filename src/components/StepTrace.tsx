/**
 * StepTrace — the user traces the letter shape with a finger.
 *
 * A faint guide glyph sits behind a drawing surface; finger strokes are
 * captured with a PanResponder and drawn as a gold path via SVG. Once enough
 * has been drawn, the Continue button enables.
 */
import { useMemo, useRef, useState } from 'react';
import { View, PanResponder, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { Button } from './Button';
import { colors, radius, spacing, layout, palette } from '@/theme';
import type { LessonStep, Letter } from '@/types/content';

const DONE_THRESHOLD = 18; // total points before tracing counts as complete

export function StepTrace({ step, onNext }: { step: LessonStep; onNext: () => void }) {
  const { width } = useWindowDimensions();
  const size = Math.min(width - layout.screenPadding * 2, 320);

  const letter = step.itemType === 'letter' ? (step.item as Letter | null) : null;
  const [strokes, setStrokes] = useState<string[][]>([]);

  const pointCount = useMemo(
    () => strokes.reduce((n, s) => n + s.length, 0),
    [strokes],
  );
  const traced = pointCount >= DONE_THRESHOLD;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setStrokes((prev) => [...prev, [`${locationX},${locationY}`]]);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setStrokes((prev) => {
          if (prev.length === 0) return [[`${locationX},${locationY}`]];
          const copy = prev.slice();
          copy[copy.length - 1] = [...copy[copy.length - 1], `${locationX},${locationY}`];
          return copy;
        });
      },
    }),
  ).current;

  return (
    <View style={styles.wrap}>
      <AppText variant="body" color="textMuted" style={styles.prompt}>
        {step.prompt ?? 'Trace the letter with your finger.'}
      </AppText>

      <View style={styles.center}>
        <View style={[styles.canvas, { width: size, height: size }]} {...pan.panHandlers}>
          {letter ? (
            <View style={styles.guideWrap} pointerEvents="none">
              <ArabicText center style={styles.guide}>
                {letter.letter}
              </ArabicText>
            </View>
          ) : null}
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            {strokes.map((pts, i) => (
              <Polyline
                key={i}
                points={pts.join(' ')}
                fill="none"
                stroke={palette.gold}
                strokeWidth={12}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Svg>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Clear" variant="ghost" onPress={() => setStrokes([])} />
        <Button label="Continue" onPress={onNext} disabled={!traced} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing['2xl'],
  },
  prompt: {
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
  },
  canvas: {
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  guideWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guide: {
    fontSize: 200,
    lineHeight: 260,
    color: colors.well,
  },
  actions: {
    gap: spacing.sm,
  },
});
