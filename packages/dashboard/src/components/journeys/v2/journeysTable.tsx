import {
  Add as AddIcon,
  ArrowDownward,
  ArrowUpward,
  Computer,
  Delete as DeleteIcon,
  Home,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  MoreVert as MoreVertIcon,
  OpenInNew as OpenInNewIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  UnfoldMore,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  GetJourneysResponseItem,
  JourneyResourceStatus,
} from "isomorphic-lib/src/types";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useUniversalRouter } from "../../../lib/authModeProvider";
import { useNamespacedTranslations } from "../../../lib/translations";
import { useCreateJourneyMutation } from "../../../lib/useCreateJourneyMutation";
import { useDeleteJourneyMutation } from "../../../lib/useDeleteJourneyMutation";
import { useJourneyMutation } from "../../../lib/useJourneyMutation";
import { useJourneysQuery } from "../../../lib/useJourneysQuery";
import { GreyButton, greyButtonStyle } from "../../greyButtonStyle";
import { DEFAULT_EDGES, DEFAULT_JOURNEY_NODES } from "../defaults";
import { JourneyStateForDraft, journeyStateToDraft } from "../store";

type Row = GetJourneysResponseItem;

function humanizeJourneyStatus(status: JourneyResourceStatus, t: (key: string) => string): string {
  switch (status) {
    case "NotStarted":
      return t("Status.NotStarted");
    case "Running":
      return t("Status.Running");
    case "Paused":
      return t("Status.Paused");
    case "Broadcast":
      return t("Status.Broadcast");
    default:
      return status;
  }
}

function ActionsCell({ row, t }: CellContext<Row, unknown> & { t: (key: string) => string }) {
  const theme = useTheme();
  const { id, status } = row.original;
  const router = useUniversalRouter();
  const journeyMutation = useJourneyMutation(id);
  const deleteJourneyMutation = useDeleteJourneyMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleStatus = () => {
    const newStatus = status === "Running" ? "Paused" : "Running";
    journeyMutation.mutate({
      status: newStatus,
    });
    handleClose();
  };

  const handleDelete = () => {
    deleteJourneyMutation.mutate(id);
    handleClose();
  };

  const handleEdit = () => {
    router.push(`/journeys/v2`, { id });
    handleClose();
  };

  const isToggleInProgress = journeyMutation.isPending;
  const isDeleteInProgress = deleteJourneyMutation.isPending;
  const isActionInProgress = isToggleInProgress || isDeleteInProgress;

  return (
    <>
      <Tooltip title={t('Actions.Actions')}>
        <IconButton
          aria-label="actions"
          onClick={handleClick}
          size="small"
          disabled={isActionInProgress}
        >
          {isActionInProgress ? (
            <CircularProgress size={20} />
          ) : (
            <MoreVertIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>
          <OpenInNewIcon fontSize="small" sx={{ mr: 1 }} />
          {t('Actions.Edit')}
        </MenuItem>
        {(status === "Running" || status === "Paused") && (
          <MenuItem onClick={handleToggleStatus} disabled={isToggleInProgress}>
            {status === "Running" ? (
              <>
                <PauseIcon fontSize="small" sx={{ mr: 1 }} />
                {t('Actions.Pause')}
              </>
            ) : (
              <>
                <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} />
                {t('Actions.Start')}
              </>
            )}
          </MenuItem>
        )}
        <MenuItem
          onClick={handleDelete}
          sx={{ color: theme.palette.error.main }}
          disabled={isDeleteInProgress}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {t('Actions.Delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

function NameCell({ row, getValue, t }: CellContext<Row, unknown> & { t: (key: string) => string }) {
  const name = getValue<string>();
  const journeyId = row.original.id;
  const universalRouter = useUniversalRouter();
  const href = universalRouter.mapUrl(`/journeys/v2`, { id: journeyId });

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title={name} placement="bottom-start">
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Typography>
      </Tooltip>
      <Tooltip title={t('Actions.Edit')}>
        <IconButton size="small" component={Link} href={href}>
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function StatusCell({ getValue, t }: CellContext<Row, unknown> & { t: (key: string) => string }) {
  const rawStatus = getValue<JourneyResourceStatus>();
  return (
    <Typography variant="body2">{humanizeJourneyStatus(rawStatus, t)}</Typography>
  );
}

function TimeCell({ getValue, t }: CellContext<Row, unknown> & { t: (key: string) => string }) {
  const timestamp = getValue<number>();
  if (!timestamp) return null;
  const date = new Date(timestamp);

  const tooltipContent = (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Computer sx={{ color: "text.secondary" }} />
        <Stack>
          <Typography variant="body2" color="text.secondary">
            {t('Time.YourDevice')}
          </Typography>
          <Typography>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            }).format(date)}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Home sx={{ color: "text.secondary" }} />
        <Stack>
          <Typography variant="body2" color="text.secondary">
            UTC
          </Typography>
          <Typography>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZone: "UTC",
            }).format(date)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );

  const formatted = formatDistanceToNow(date, { addSuffix: true });
  return (
    <Tooltip title={tooltipContent} placement="bottom-start" arrow>
      <Typography variant="body2">{formatted}</Typography>
    </Tooltip>
  );
}

export default function JourneysTable() {
  const router = useUniversalRouter();
  const t = useNamespacedTranslations('JourneyEditor');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [journeyName, setJourneyName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const query = useJourneysQuery({
    resourceType: "Declarative",
  });
  const createJourneyMutation = useCreateJourneyMutation();
  const journeysData: Row[] = useMemo(
    () => query.data?.journeys ?? [],
    [query.data],
  );

  useEffect(() => {
    if (query.isError) {
      setSnackbarMessage(t('Notifications.LoadError'));
      setSnackbarOpen(true);
    }
  }, [query.isError, t]);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "name",
        header: t('Table.Name'),
        accessorKey: "name",
        cell: (props) => <NameCell {...props} t={t} />,
      },
      {
        id: "status",
        header: t('Table.Status'),
        accessorKey: "status",
        cell: (props) => <StatusCell {...props} t={t} />,
      },
      {
        id: "createdAt",
        header: t('Table.CreatedAt'),
        accessorKey: "createdAt",
        cell: (props) => <TimeCell {...props} t={t} />,
      },
      {
        id: "actions",
        header: "",
        size: 70,
        cell: (props) => <ActionsCell {...props} t={t} />,
      },
    ],
    [t],
  );

  const table = useReactTable({
    columns,
    data: journeysData,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  const handleCreateJourney = () => {
    if (journeyName.trim() && !createJourneyMutation.isPending) {
      const stateForDraft: JourneyStateForDraft = {
        journeyNodes: DEFAULT_JOURNEY_NODES,
        journeyEdges: DEFAULT_EDGES,
      };
      const draft = journeyStateToDraft(stateForDraft);

      createJourneyMutation.mutate(
        { name: journeyName.trim(), draft },
        {
          onSuccess: (data) => {
            setSnackbarMessage(t('Notifications.SaveSuccess'));
            setSnackbarOpen(true);
            setDialogOpen(false);
            setJourneyName("");
            router.push(`/journeys/v2`, { id: data.id });
          },
          onError: () => {
            setSnackbarMessage(t('Notifications.SaveError'));
            setSnackbarOpen(true);
          },
        },
      );
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setJourneyName("");
  };

  return (
    <>
      <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{t('Header.Title')}</Typography>
          <Button
            variant="contained"
            sx={greyButtonStyle}
            onClick={() => setDialogOpen(true)}
            startIcon={<AddIcon />}
          >
            {t('Actions.CreateNew')}
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                      sortDirection={header.column.getIsSorted() || false}
                    >
                      {header.isPlaceholder ? null : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "default",
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <IconButton
                              onClick={header.column.getToggleSortingHandler()}
                              size="small"
                              sx={{ ml: 0.5 }}
                              aria-label={`${t('Table.SortBy')} ${header.column.columnDef.header}`}
                            >
                              {{
                                asc: <ArrowUpward fontSize="inherit" />,
                                desc: <ArrowDownward fontSize="inherit" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <UnfoldMore
                                  fontSize="inherit"
                                  sx={{ opacity: 0.5 }}
                                />
                              )}
                            </IconButton>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {!query.isFetching &&
                !query.isLoading &&
                journeysData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      {t('Table.NoJourneys')}
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
            <TableFooter sx={{ position: "sticky", bottom: 0 }}>
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <GreyButton
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        startIcon={<KeyboardDoubleArrowLeft />}
                      >
                        {t('Pagination.First')}
                      </GreyButton>
                      <GreyButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        startIcon={<KeyboardArrowLeft />}
                      >
                        {t('Pagination.Previous')}
                      </GreyButton>
                      <GreyButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        endIcon={<KeyboardArrowRight />}
                      >
                        {t('Pagination.Next')}
                      </GreyButton>
                      <GreyButton
                        onClick={() =>
                          table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                        endIcon={<KeyboardDoubleArrowRight />}
                      >
                        {t('Pagination.Last')}
                      </GreyButton>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          minWidth: "40px",
                          justifyContent: "center",
                        }}
                      >
                        {query.isFetching && (
                          <CircularProgress color="inherit" size={20} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('Pagination.Page')}{" "}
                        <strong>
                          {table.getState().pagination.pageIndex + 1} {t('Pagination.Of')}{" "}
                          {table.getPageCount() === 0
                            ? 1
                            : table.getPageCount()}
                        </strong>
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        TransitionProps={{ onEntered: () => nameInputRef.current?.focus() }}
      >
        <DialogTitle>{t('Dialog.CreateTitle')}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label={t('Settings.Name')}
            type="text"
            fullWidth
            variant="standard"
            value={journeyName}
            onChange={(e) => setJourneyName(e.target.value)}
            inputRef={nameInputRef}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateJourney();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{t('Settings.Cancel')}</Button>
          <Button
            onClick={handleCreateJourney}
            disabled={!journeyName.trim() || createJourneyMutation.isPending}
          >
            {createJourneyMutation.isPending ? t('Dialog.Creating') : t('Dialog.Create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
