000100070317     F**********************************************************************    000200980821     F*�F i l e s                                                               000300980821     F**********************************************************************    000400070201     FCUSTSELD  CF   E             WORKSTN                                      000500070201     F                                     SFILE(ZZSFL:SFLRRN)                  000600070201     FCUSTS     IF   E           K DISK                                         000700070201     C*******************************************************************       000800070201     C*�M a i n l i n e   C o d e                                               000900090311     C*                                                                         001000090311     C* BEGIN ANNOTATION                                                        001100090311     C* This line of documentation and the next will appear in both the         001200090311     C* source of the program and the generated documenation.                   001300090311                                                                                001400070201     C                   EXSR      ZBUILD                                       001500070201     C*�Until Exit/Cancel                                                       001600070201     C     *IN03         DOWEQ     '0'                                          001700070201     C     *IN12         ANDEQ     '0'                                          001800070201     C*�Display screen                                                          001900070201     C                   EXFMT     ZZCTL                                        002000070201     C*�If Exit/Cancel                                                          002100070201     C     *IN03         IFEQ      '1'                                          002200070201     C     *IN12         OREQ      '1'                                          002300070201     C***                  MOVE *BLANKS   CUSTOM                                002400070201     C***                  MOVE *BLANKS   PNAME                                 002500070201     C                   LEAVE                                                  002600070201     C                   ENDIF                                                  002700070201     C*�If selection made                                                       002800070201     C                   READC     ZZSFL                                  30    002900070201     C     *IN30         IFEQ      '0'                                          003000070201     C                   MOVEL     XWBCCD        CUSTOM                         003100070201     C                   MOVEL     XWG4TX        PNAME                          003200070201     C                   LEAVE                                                  003300070201     C                   ENDIF                                                  003400070201     C*�End: Until Exit/Cancel                                                  003500070201     C                   ENDDO                                                  003600070201     C*�Terminate program                                                       003700070201     C                   MOVE      '1'           *INLR                          003800070201     C                   RETURN                                                 003900070201     C*******************************************************************       004000070201     C* L o g i c a l   E n d   o f   P r o g r a m                             004100070201     C*******************************************************************       004200070201     C*******************************************************************       004300070201     C     ZBUILD        BEGSR                                                  004400070201     C******************************************************************        004500070201     C*�Subroutine: Build subfile                                               004600070201     C******************************************************************        004700070201     C                   MOVE      *ZEROS        SFLRRN            5 0          004800070201     C     *LOVAL        SETLL     CUSTS                                        004900070201     C                   READ(N)   CUSTS                                  31    005000070201     C     *IN31         DOWEQ     '0'                                          005100070201     C                   ADD       1             SFLRRN                         005200070201     C                   WRITE     ZZSFL                                        005300070201     C                   READ(N)   CUSTS                                  31    005400070201     C                   ENDDO                                                  005500070201     C     SFLRRN        IFGT      0                                            005600070201     C                   MOVE      '1'           *IN31                          005700070201     C                   ENDIF                                                  005800070201     C                   ENDSR                                                  005900070201     C*******************************************************************       006000070201     C*******************************************************************       006100050722     C*�N o n - e x e c u t a b l e   C o d e                                   006200070201     C*******************************************************************       006300050801     C*�*ENTRY Parameter List                                                   006400070201     C     *ENTRY        PLIST                                                  006500070201     C                   PARM                    CUSTOM           11            006600070201     C                   PARM                    PNAME            40            006700050722     C**********************************************************************    