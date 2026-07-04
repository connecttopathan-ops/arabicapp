/**
 * ErrorBoundary — catches render-time errors and shows the message on screen
 * (instead of a silent crash), so issues are diagnosable in standalone builds.
 * Uses hardcoded colours so it works even if theming/providers failed.
 */
import { Component, type ReactNode } from 'react';
import { ScrollView, Text } from 'react-native';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#1A1512' }}
        contentContainerStyle={{ padding: 24, paddingTop: 72 }}
      >
        <Text style={{ color: '#E8BC6A', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
          MASAR ran into a problem
        </Text>
        <Text style={{ color: '#EFEAE0', fontSize: 15, marginBottom: 16 }}>
          {String(error?.message ?? error)}
        </Text>
        <Text style={{ color: '#B5ADA0', fontSize: 11 }} selectable>
          {String(error?.stack ?? '').slice(0, 2000)}
        </Text>
      </ScrollView>
    );
  }
}
