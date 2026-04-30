import { Alert, Button, Container, Stack, Text, Title } from "@mantine/core";
import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Render error:", error, info);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <Container size="sm" py="xl">
          <Stack>
            <Title order={1} ta="center">
              Une erreur est survenue
            </Title>
            <Alert color="red" icon={<AlertTriangle size={18} />}>
              <Text fw={700}>{this.state.error.message}</Text>
            </Alert>
            <Button onClick={this.handleReload} variant="filled">
              Recharger l'application
            </Button>
          </Stack>
        </Container>
      );
    }
    return this.props.children;
  }
}
